
export interface MessageBody{
    from: string,
    to: string,
    data: string | BinaryType,
    type: string,
    name: string
}