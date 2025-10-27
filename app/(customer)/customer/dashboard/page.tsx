"use client"


import Header from "@/components/customers/header"
import Navbar from "@/components/customers/navbar"
import Image from "next/image"

export default function CustomerDashPage() {
    return (
        <div className="pb-16 "> {/* ruang bawah untuk navbar */}
            <Header />

            <main className="p-4">
                <p className="text-gray-700 text-base font-medium mb-3">
                    Mau nitip apa hari ini?
                </p>

                <div className="flex justify-between mb-5">
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-100  rounded-lg mb-1">
                            <Image src="/titip-barang.png" alt="Titip Barang" width={50} height={50} />
                        </div>
                        <span className="text-sm">Titip Barang</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-100  rounded-lg mb-1">
                            <Image src="/titip-bangunan.png" alt="Titip Barang" width={50} height={50} />
                        </div>
                        <span className="text-sm">Titip Bangunan</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-100  rounded-lg mb-1">
                            <Image src="/titip-mobil.png" alt="Titip Barang" width={50} height={50} />
                        </div>
                        <span className="text-sm">Titip Kendaraan</span>
                    </div>
                </div>

                {/* Banner Promo */}
                <div className="border border-green-200 rounded-xl overflow-hidden">
                    <div className="p-4">
                        <p className="text-green-700 font-semibold mb-1">
                            Nitip aman, kantong aman ✅
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                            Ayo nitip guak nitip, nitip yuk, kuy cobain!
                        </p>
                        <Image
                            src="/promo.png"
                            alt="Cashback Promo"
                            width={400}
                            height={200}
                            className="rounded-lg"
                        />
                    </div>
                </div>
            </main>

            <Navbar />
        </div>
    )
}
