export enum HttpStatus {
    OK = 200,


    CREATED = 201,
    ACCEPTED = 202,

    NO_CONTENT = 204, // 相应成功了，但是没有响应体

    BAD_REQUEST = 400,

    UNAUTHORIZED = 401, // 用户未授权，没权限

    FORBIDDEN = 403, // 用户禁止访问，登陆了没权限

    NOT_FOUND = 404,

    INTERNAL_SERVER_ERROR=500, // 服务器错误

    BAD_GATEWAY = 502,

    REQUEST_TIMEOUT = 408 // 超时错误
}