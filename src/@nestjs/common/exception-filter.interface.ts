// 异常过滤器的接口

import { ArgumentsHost } from "./arguments-host.interface"

export interface ExceptionFilter<T = any> {
    catch(exception: T, host: ArgumentsHost):any 
}