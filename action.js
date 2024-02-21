const ACTION = {
    ROOM_JOIN: 'room:join',
    USER_JOIN: 'user:join',
    USER_CALL: 'user:call',
    INCOMING_CALL: 'incoming:call',
    CALL_ACCEPTED: 'call:accepted',
    SEND_STREAM: 'send:stream',
    SEND_TEXT_MESSAGE: 'send:text:message',
    RECIEVE_TEXT_MESSAGE: 'recieve:text:message',
    SEND_OWN_ID: 'send:own:id',
    RECIEVE_USER_ID: 'recieve:user:id'
}
module.exports = ACTION;