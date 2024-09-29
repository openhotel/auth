import { System } from "system/main.ts";
import { TickerQueue } from "@oh/queue";
import { getServerSessionList } from "shared/utils/main.ts";

export const sessions = () => {
  const sessionMap: Record<string, any> = {};

  const $disconnectFromLastServer = (accountId: string, server: string) => {
    const headers = new Headers();
    headers.append("auth-server", performance.now() + "");

    console.error(`${server}/auth/user-disconnected?accountId=${accountId}`);
    fetch(`${server}/auth/user-disconnected?accountId=${accountId}`, {
      headers,
    }).catch((e) => {
      console.error(e);
      //we don't really care if server receives our petition, the session is being invalidated anyway
    });
    delete sessionMap[accountId];
  };

  const $checkSessions = async () => {
    const currentSessions = Object.keys(sessionMap);
    const targetSessions = await getServerSessionList();
    console.log(
      `Checking sessions... (${currentSessions.length}..${targetSessions.length})`,
    );

    //check disconnected accounts
    for (const accountId of Object.keys(sessionMap))
      await checkAccountSession(accountId);

    //update sessions
    for (const {
      key: [, accountId],
      value: session,
    } of targetSessions)
      sessionMap[accountId] = session;
  };

  const load = () => {
    System.tasks.add({
      type: TickerQueue.REPEAT,
      repeatEvery: System.getConfig().sessions.checkInterval * 1000,
      onFunc: $checkSessions,
    });
    $checkSessions();
  };

  const checkAccountSession = async (accountId: string) => {
    const foundSession = await System.db.get([
      "serverSessionByAccount",
      accountId,
    ]);
    //check if is server claimed the session
    const isFoundSessionClaimed = foundSession?.value?.claimed;
    const session = sessionMap[accountId];

    //if account has no active session or old session
    if (!isFoundSessionClaimed && !session) return;

    //account is disconnected, disconnect from las server
    if (!isFoundSessionClaimed)
      return $disconnectFromLastServer(accountId, session.server);

    const currentSession = foundSession.value;

    //there's no current session active, we assign the current one
    if (!session) {
      sessionMap[accountId] = currentSession;
      return;
    }

    //check if session server changed if so, disconnect from last server
    if (
      session.sessionId !== currentSession.sessionId ||
      session.ticketId !== currentSession.ticketId ||
      session.server !== currentSession.server
    ) {
      $disconnectFromLastServer(accountId, session.server);
      // reassign data
      sessionMap[accountId] = currentSession;
    }
  };

  return {
    load,
    checkAccountSession,
  };
};
