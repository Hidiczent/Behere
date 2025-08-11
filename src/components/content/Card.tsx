
import { Link } from "react-router-dom";
import confidenceImg from '@/assets/img/content/confiden1.jpg';
import makefriendimg from '@/assets/img/content/makefriend2.jpg';
import pressure from '@/assets/img/content/pressure.jpg';
import lovemyself4 from '@/assets/img/content/lovemyself4.jpg';
import depressed5 from '@/assets/img/content/depressed5.jpg';
import loveself6 from '@/assets/img/content/loveself6.jpg';
export const Card = () => {
    return (
        <div className="font-laoLooped text-gray-800">
            {/* Header */}
            <header className=" p-5 text-primary text-center">
                <h1 className="m-0  text-2xl font-bold">
                    ບົດຄວາມທີ່ໃຫ້ກຳລັງໃຈ ປະຈຳອາທິດ
                </h1>
                <p className="mt-1 text-[#00334d]">
                    ລວມເລື່ອງລາວ ແລະ ຄຳເວົ້າທີ່ຈະຊ່ວຍເຕີມພະລັງໃຈໃຫ້ເຈົ້າ
                </p>
            </header>
            {/* Card Container */}
            <main>
                <section className="flex justify-center gap-5 flex-wrap p-5">
                    {/* Card 1 */}
                    <div className="bg-white rounded-lg shadow-md w-[300px] text-center p-4 transition-transform duration-200 hover:-translate-y-1">
                        <Link to="/confident">
                            <img
                                src={confidenceImg}
                                alt="confident"
                                className="max-w-full rounded-lg"
                            />
                        </Link>
                        <h3 className="mt-3 font-semibold">
                            ພັດທະນາຄວາມມັ່ນໃຈໃນໂຕເອງແມ່ນບາດກ້າວທຳອິດເພື່ອຄວາມສໍາເລັດ
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            ຄວາມເຊື່ອໝັ້ນບໍ່ແມ່ນເລື່ອງຍາກທີ່ຈະພັດທະນາ,
                            ຕາບໃດທີ່ເຮົາມີຄວາມຕັ້ງໃຈທີ່ຈະປະເຊີນກັບທຸກສິ່ງທ້າທາຍທີ່ຈະມາເຖິງ
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-lg shadow-md w-[300px] text-center p-4 transition-transform duration-200 hover:-translate-y-1">
                        <Link to="/make-friends">
                            <img
                                src={makefriendimg}
                                alt="make friends"
                                className="max-w-full rounded-lg"
                            />
                        </Link>
                        <h3 className="mt-3 font-semibold">
                            ແນະນຳ 20 ວິທີໃນການພັດທະນາທັກສະສັງຄົມໃຫ້ເຂົ້າກັບຫມູ່ຮ່ວມງານໄດ້ດີ
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            ເຄັດລັບການພັດທະນາທັກສະທາງສັງຄົມທີ່ສາມາດນໍາໃຊ້ໄດ້ທັງການເຮັດວຽກ
                            ແລະ ໃນໄວຮຽນ
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-lg shadow-md w-[300px] text-center p-4 transition-transform duration-200 hover:-translate-y-1">
                        <Link to="/pressure">
                            <img
                                src={pressure}
                                alt="pressure"
                                className="max-w-full rounded-lg"
                            />
                        </Link>
                        <h3 className="mt-3 font-semibold">
                            ວິທີຮັບມືກັບຄວາມກົດດັນໃນບ່ອນເຮັດວຽກແບບມືອາຊິບ
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            ຄວາມກົດດັນໃນການເຮັດວຽກແມ່ນປັດໃຈທີ່ສົ່ງຜົນກະທົບຕໍ່ການເຮັດວຽກທີ່ແຕກຕ່າງກັນໃນອາຊີບທີ່ແຕກຕ່າງກັນ
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white rounded-lg shadow-md w-[300px] text-center p-4 transition-transform duration-200 hover:-translate-y-1">
                        <Link to="/lovemyself4ssure">
                            <img
                                src={lovemyself4}
                                alt="lovemyself4"
                                className="max-w-full rounded-lg"
                            />
                        </Link>
                        <h3 className="mt-3 font-semibold">
                            ແນະນຳວິທີງ່າຍໆທີ່ຈະເຮັດໃຫ້ເຮົາກາຍເປັນຄົນທີ່ຮັກໂຕເອງ
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            ຄໍາວ່າ"ຮັກຕົນເອງ" ແມ່ນເວົ້າງ່າຍ,ແຕ່ມັນກໍ່ເປັນການຍາກທີ່ຈະເຮັດ ຫຼື ຄົນອື່ນອາດເຂົ້າໃຈຜິດວ່າການຮັກໂຕເອງແມ່ນຄວາມເຫັນແກ່ຕົວ
                        </p>
                    </div>

                    {/* Card 5 */}
                    <div className="bg-white rounded-lg shadow-md w-[300px] text-center p-4 transition-transform duration-200 hover:-translate-y-1">
                        <Link to="/depressed5">
                            <img
                                src={depressed5}
                                alt="depressed5"
                                className="max-w-full rounded-lg"
                            />
                        </Link>
                        <h3 className="mt-3 font-semibold">
                            ແນະນຳ 4 ວິທີໃນການຮັບມືກັບຄວາມຜິດຫວັງ
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            ຄວາມຜິດຫວັງເປັນເລື່ອງຍາກທີ່ຈະຫຼີກລ່ຽງໄດ້.ແຕ່ເມື່ອມັນເກີດຂຶ້ນ, ພວກເຮົາຕ້ອງການວິທີທີ່ເຫມາະສົມເພື່ອຈັດການກັບຄວາມຜິດຫວັງ
                        </p>
                    </div>

                    {/* Card 6 */}
                    <div className="bg-white rounded-lg shadow-md w-[300px] text-center p-4 transition-transform duration-200 hover:-translate-y-1">
                        <Link to="/loveself6">
                            <img
                                src={loveself6}
                                alt="loveself6"
                                className="max-w-full rounded-lg"
                            />
                        </Link>
                        <h3 className="mt-3 font-semibold">
                            ຮັກໂຕເອງໃຫ້ເປັນເພາະເຮົາແມ່ນຄົນທີ່ສົມຄວນຖືກຮັກຫຼາຍທີ່ສຸດ
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            ຄວາມຮັກຕົນເອງ ໝາຍເຖິງ ຄວາມຮູ້ສຶກໃນແງ່ດີຕໍ່ຕົນເອງທີ່ມາຈາກການຍອມຮັບທັງດ້ານດີ ແລະ ດ້ານບໍ່ດີຂອງຕົນເອງ
                        </p>
                    </div>
                </section>
            </main>

        </div>
    );
};
