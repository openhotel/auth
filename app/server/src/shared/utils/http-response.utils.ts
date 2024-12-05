import { HTTPStatusCode } from "shared/enums/http-status-code.enums.ts";
import { HTTPStatusMessage } from "shared/enums/http-status-message.enums.ts";

type HttpResponseData = Record<string, any>;

type HttpResponseOptions = {
  message?: string;
  data?: HttpResponseData;
};

export class HttpResponse {
  public static ok(opts: HttpResponseOptions): Response {
    return Response.json(
      { statusCode: HTTPStatusCode.OK, status: HTTPStatusMessage.OK, ...opts },
      { status: HTTPStatusCode.OK },
    );
  }

  public static created(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.CREATED,
        status: HTTPStatusMessage.CREATED,
        ...opts,
      },
      { status: HTTPStatusCode.CREATED },
    );
  }

  public static accepted(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.ACCEPTED,
        status: HTTPStatusMessage.ACCEPTED,
        ...opts,
      },
      { status: HTTPStatusCode.ACCEPTED },
    );
  }

  public static noContent(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.NO_CONTENT,
        status: HTTPStatusMessage.NO_CONTENT,
        ...opts,
      },
      { status: HTTPStatusCode.NO_CONTENT },
    );
  }

  public static partialContent(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.PARTIAL_CONTENT,
        status: HTTPStatusMessage.PARTIAL_CONTENT,
        ...opts,
      },
      { status: HTTPStatusCode.PARTIAL_CONTENT },
    );
  }

  public static multipleChoices(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.MULTIPLE_CHOICES,
        status: HTTPStatusMessage.MULTIPLE_CHOICES,
        ...opts,
      },
      { status: HTTPStatusCode.MULTIPLE_CHOICES },
    );
  }

  public static movedPermanently(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.MOVED_PERMANENTLY,
        status: HTTPStatusMessage.MOVED_PERMANENTLY,
        ...opts,
      },
      { status: HTTPStatusCode.MOVED_PERMANENTLY },
    );
  }

  public static found(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.FOUND,
        status: HTTPStatusMessage.FOUND,
        ...opts,
      },
      { status: HTTPStatusCode.FOUND },
    );
  }

  public static badRequest(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.BAD_REQUEST,
        status: HTTPStatusMessage.BAD_REQUEST,
        ...opts,
      },
      { status: HTTPStatusCode.BAD_REQUEST },
    );
  }

  public static unauthorized(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.UNAUTHORIZED,
        status: HTTPStatusMessage.UNAUTHORIZED,
        ...opts,
      },
      { status: HTTPStatusCode.UNAUTHORIZED },
    );
  }

  public static paymentRequired(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.PAYMENT_REQUIRED,
        status: HTTPStatusMessage.PAYMENT_REQUIRED,
        ...opts,
      },
      { status: HTTPStatusCode.PAYMENT_REQUIRED },
    );
  }

  public static forbidden(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.FORBIDDEN,
        status: HTTPStatusMessage.FORBIDDEN,
        ...opts,
      },
      { status: HTTPStatusCode.FORBIDDEN },
    );
  }

  public static notFound(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.NOT_FOUND,
        status: HTTPStatusMessage.NOT_FOUND,
        ...opts,
      },
      { status: HTTPStatusCode.NOT_FOUND },
    );
  }

  public static methodNotAllowed(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.METHOD_NOT_ALLOWED,
        status: HTTPStatusMessage.METHOD_NOT_ALLOWED,
        ...opts,
      },
      { status: HTTPStatusCode.METHOD_NOT_ALLOWED },
    );
  }

  public static requestTimeout(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.REQUEST_TIMEOUT,
        status: HTTPStatusMessage.REQUEST_TIMEOUT,
        ...opts,
      },
      { status: HTTPStatusCode.REQUEST_TIMEOUT },
    );
  }

  public static conflict(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.CONFLICT,
        status: HTTPStatusMessage.CONFLICT,
        ...opts,
      },
      { status: HTTPStatusCode.CONFLICT },
    );
  }

  public static gone(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.GONE,
        status: HTTPStatusMessage.GONE,
        ...opts,
      },
      { status: HTTPStatusCode.GONE },
    );
  }

  public static unprocessableEntity(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.UNPROCESSABLE_ENTITY,
        status: HTTPStatusMessage.UNPROCESSABLE_ENTITY,
        ...opts,
      },
      { status: HTTPStatusCode.UNPROCESSABLE_ENTITY },
    );
  }

  public static tooManyRequests(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.TOO_MANY_REQUESTS,
        status: HTTPStatusMessage.TOO_MANY_REQUESTS,
        ...opts,
      },
      { status: HTTPStatusCode.TOO_MANY_REQUESTS },
    );
  }

  public static internalServerError(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.INTERNAL_SERVER_ERROR,
        status: HTTPStatusMessage.INTERNAL_SERVER_ERROR,
        ...opts,
      },
      { status: HTTPStatusCode.INTERNAL_SERVER_ERROR },
    );
  }

  public static notImplemented(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.NOT_IMPLEMENTED,
        status: HTTPStatusMessage.NOT_IMPLEMENTED,
        ...opts,
      },
      { status: HTTPStatusCode.NOT_IMPLEMENTED },
    );
  }

  public static badGateway(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.BAD_GATEWAY,
        status: HTTPStatusMessage.BAD_GATEWAY,
        ...opts,
      },
      { status: HTTPStatusCode.BAD_GATEWAY },
    );
  }

  public static serviceUnavailable(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.SERVICE_UNAVAILABLE,
        status: HTTPStatusMessage.SERVICE_UNAVAILABLE,
        ...opts,
      },
      { status: HTTPStatusCode.SERVICE_UNAVAILABLE },
    );
  }

  public static gatewayTimeout(opts: HttpResponseOptions): Response {
    return Response.json(
      {
        statusCode: HTTPStatusCode.GATEWAY_TIMEOUT,
        status: HTTPStatusMessage.GATEWAY_TIMEOUT,
        ...opts,
      },
      { status: HTTPStatusCode.GATEWAY_TIMEOUT },
    );
  }
}
