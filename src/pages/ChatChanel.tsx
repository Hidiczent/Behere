import ChatChannel from "../components/ChatChanel/ChatChannel";
import chatBubble from "../assets/Icons/Chat.png"; // หรือ .svg

const About = () => {
  return (
    <div className="text-center p-10">
      <ChatChannel
        title="ສຳນວນບົດບາດ"
        leftText="ພ້ອມທີ່ຈະລະບາຍເລື່ອງໃນໃຈໃຫ້ຜູ້ຟັງ"
        rightText="ພ້ອມທີ່ຈະຮັບຟັງຜູ້ລະບາຍແລ້ວ"
        leftLabel="ຜູ້ລະບາຍ"
        rightLabel="ຜູ້ຮັບຟັງ"
        leftIcon={chatBubble}
      
        // ไม่ส่ง rightIcon ก็ได้ จะ mirror รูปซ้ายให้เอง
        // rightIcon={chatBubble} // ถ้ามีไฟล์อีกใบก็ส่งอันนี้แทนและตั้ง mirrorRight={false}
      />
    </div>
  );
};

export default About;
