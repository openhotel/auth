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
  };

  const $checkSessions = async () => {
    const currentSessions = Object.keys(sessionMap);
    const targetSessions = await getServerSessionList();
    console.log(
      `Checking sessions... (${currentSessions.length}..${targetSessions.length})`,
    );

    const accountCheckList = [
      ...new Set([
        ...currentSessions,
        ...targetSessions.map<string>(({ key: [, accountId] }) => accountId),
      ]),
    ];

    //check accounts
    for (const accountId of accountCheckList) checkAccountSession(accountId);
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

    console.warn(
      accountId,
      "->",
      session?.server,
      "->",
      foundSession?.value?.server,
      "<<<<",
    );

    //if account has no active session or old session
    if (!isFoundSessionClaimed && !session) return;

    //account is disconnected, disconnect from last server
    if (!isFoundSessionClaimed) {
      $disconnectFromLastServer(accountId, session.server);
      return;
    }

    const currentSession = foundSession.value;

    //check if session server exists and changed if so disconnect from last server
    if (
      session &&
      (session.sessionId !== currentSession.sessionId ||
        session.ticketId !== currentSession.ticketId ||
        session.server !== currentSession.server)
    ) {
      $disconnectFromLastServer(accountId, session.server);
    }
    //reassign server session
    sessionMap[accountId] = currentSession;
  };

  return {
    load,
    checkAccountSession,
  };
};
