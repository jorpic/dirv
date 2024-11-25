
pub struct MsgPriority(u16);
pub struct Addr(u16);

#[repr(u16)]
pub enum MsgType {
    General = 0b0000,
    Group   = 0b0001,
    Target  = 0b0110,
    Notification = 0b1100,
    Info1 = 0b1101,
    Info2 = 0b1110,
    Control = 0b1111,
}

#[repr(u16)]
pub enum Command {
    Nop = 0,
    Test = 1,
    Ish = 2,
    Imit1 = 3,
    Imit2 = 4,
    Imit3 = 5,
    OsnDzch = 6,
    RezDzch = 7,
    OsnDgi = 8,
    RezDgi = 9,
    OsnDni = 10,
    ResDni = 11,
}

pub struct Message<Data> {
    priority: MsgPriority,
    msg_type: MsgType,
    sender: Addr,
    reciver: Addr,
    data: Data,
}

impl Message<Command> {
    pub fn new_command(cmd: Command, sender: Addr, receiver: Addr) -> Self {
        use Command::*;
        let msg_type = match cmd {
            Nop | Test | Ish => MsgType::General,
            _ => MsgType::Target,
        };
        Message {
            priority: MsgPriority(3),
            msg_type,
            sender,
            receiver,
            data: cmd
        }
    }

    pub fn new_notification(cmd: Command, sender: Addr, receiver: Addr) -> Self {
        Message {
            priority: MsgPriority(0),
            msg_type: MsgType::Notification,
            sender,
            receiver,
            data: cmd
        }
    }
}



#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        assert_eq!(true, true);
    }
}
