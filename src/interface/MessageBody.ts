
export interface MessageBody{
    from: string,
    to: string,
    message: string | BinaryType,
    type: string,
    name: string
}