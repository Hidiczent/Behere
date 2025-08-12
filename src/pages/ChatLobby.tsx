// ใน ChatLobby.tsx
import ChatLopby from "../components/ChatChanel/ChatLopby";
import chatBubble from "../assets/Icons/Chat.png";

const ChatLobby = () => {
  return (
    <div className="text-center p-10">
      <ChatLopby
        title="ສຳນວນບົດບາດ"
        leftText="ພ້ອມທີ່ຈະລະບາຍເລື່ອງໃນໃຈໃຫ້ຜູ້ຟັງ"
        rightText="ພ້ອມທີ່ຈະຮັບຟັງຜູ້ລະບາຍແລ້ວ"
        leftLabel="ຜູ້ລະບາຍ"
        rightLabel="ຜູ້ຮັບຟັງ"
        leftIcon={chatBubble}
      />

      {/* ปุ่มเลือกบทบาท */}

    </div>
  );
};

export default ChatLobby;
