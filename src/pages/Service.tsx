export default function AboutUs() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Page container */}
      <section className="relative mx-auto max-w-10xl px-6 sm:px-8 lg:px-12 py-10">
        {/* soft bg accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[280px] bg-gradient-to-b from-sky-50 to-transparent" />
        {/* Card */}
        <div className="relative rounded-2xl bg-white/90 p-10 sm:p-14 shadow-xl ring-1 ring-slate-200">
          {/* hairline */}
          <div className="mx-auto mb-8 h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
          {/* Quote / Intro */}
          <div className="text-center ">
            <p className="mx-auto max-w-3xl text-pretty text-slate-600 text-[17px] sm:text-lg leading-8 sm:leading-9 font-laoLooped ">
              <span className="block font-medium text-primary">
                “ແນວຄວາມຄິດ: ຢູ່ນີ້ ແລະ ຮັບຮູ້ຄວາມຮູ້ສຶກຂອງເຮົາ.”
              </span>
              <br />
              <span className="font-bold text-primary">Be here</span>{" "}
              ແມ່ນການຢືນຢູ່ກັບປັດຈຸບັນ ເຫັນຄວາມຮູ້ສຶກຂອງເຮົາຢ່າງຈິງໆ
              ໂດຍບໍ່ຕັດສິນ. ມັນເປັນພື້ນທີ່ປອດໄພໃຫ້ແຕ່ລະຄົນໄດ້ເວົ້າ ໄດ້ຟັງ
              ແລະໄດ້ຢູ່ກັບຕົນເອງ.
              <br />
              ເມື່ອເຮົາເຫັນ ແລະ ຢອມຮັບຄວາມຮູ້ສຶກຂອງຕົນ ຄວາມເຄັ່ງຕຶງຄ່ອຍໆຜ່ອນຄາຍ
              ແລະ ພາເຮົາໄປພົບກັບຄວາມເບົາບາງດ້ານໃນ.
              <br />
              ເຮົາເຊື່ອວ່າການໄດ້ຢູ່ນີ້ ຮັບຟັງເຊິ່ງກັນແລະກັນ
              ແມ່ນຈຸດເລີ່ມຕົ້ນຂອງການເຂົ້າໃຈຕົນເອງ ແລະ ການເຂົ້າໃຈກັນ.
            </p>

            {/* Section Title */}
            <h2 className="mt-8 text-3xl sm:text-4xl font-bold tracking-tight text-slate-800 font-laoLooped">
              ກ່ຽວກັບພວກເຮົາ
            </h2>

            {/* Divider + CTA */}
            <div className="mx-auto mt-8 flex w-full max-w-lg items-center justify-center gap-6 font-laoLooped">
              <a
                href="#team"
                className="font-medium text-primary underline-offset-4 hover:underline text-base sm:text-lg\"
              >
                ທີມງານຂອງເຮົາ
              </a>
              <span aria-hidden className="h-10 w-px w-1 bg-primary" />
              <a
                href="#privacy"
                className="font-medium text-primary underline-offset-4 hover:underline text-base sm:text-lg\"
              >
                ນະໂຍບາຍຄວາມເປັນສ່ວນຕົວ
              </a>
            </div>
          </div>
        </div>

        {/* Optional extra blocks you can keep or remove */}
      </section>
    </main>
  );
}
