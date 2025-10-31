'use client'

import Header from '@/components/customers/header'
import Navbar from '@/components/customers/navbar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Badge, CalendarIcon, MapPin, PhoneCallIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { LoadingSpinner } from '@/components/loading-spinner'

type VendorBranch = {
    id: string
    vendorId: string
    name: string
    address: string
    phone: string
}

type Category = {
    id: string
    title: string
    price: number
    description: string
}

type Goods = {
    id: string
    vendorBranchId: string
    categoryId: string
    name: string
    quantity: number
    totalPrice: number
    dateIn: string
    dateOut: string
    dayTotal: number
    paymentMethod: string
    bank: string
}

export default function OrderPage() {
    const [vendorBranch, setVendorBranch] = useState<VendorBranch[]>([])
    const [category, setCategory] = useState<Category[]>([])
    const [goods, setGoods] = useState<Goods[]>([])
    const [open, setOpen] = useState(false)
    const [selectedBranch, setSelectedBranch] = useState<string>("")

    // Form state
    const [categoryId, setCategoryId] = useState("")
    const [name, setName] = useState("")
    const [quantity, setQuantity] = useState<number>(1)
    const [dateIn, setDateIn] = useState<Date | undefined>()
    const [dateOut, setDateOut] = useState<Date | undefined>()
    const [paymentMethod, setPaymentMethod] = useState("")
    const [bank, setBank] = useState("")
    const [loading, setLoading] = useState(false)


    // --- Fetch data sekali ---
    useEffect(() => {
        const fetchBranch = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor/branch`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('titipsini_token')}`,
                    },
                })
                if (!res.ok) throw new Error('Gagal memuat cabang mitra')
                const data = await res.json()
                setVendorBranch(data)
            } catch (error) {
                console.error(error)
            }
        }

        const fetchCategory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goods/category`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('titipsini_token')}`,
                    },
                })
                if (!res.ok) throw new Error('Gagal memuat kategori')
                const data = await res.json()
                setCategory(data)
            } catch (error) {
                console.error(error)
            }
        }

        const fetchGoods = async () => {
            try {
                const userData = localStorage.getItem("titipsini_user")

                if (!userData) {
                    console.warn("User data tidak ditemukan di localStorage")
                    return
                }

                const user = JSON.parse(userData)
                const userId = user.id

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goods?userId=${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`,
                    },
                })

                if (!res.ok) throw new Error("Gagal memuat data titipan")

                const data = await res.json()

                setGoods(data.data)
            } catch (error) {
                console.error("Error saat memuat goods:", error)
            }
        }
        fetchBranch()
        fetchCategory()
        fetchGoods()
    }, [])

    // --- Create Goods ---
    const handleCreateGoods = async () => {
        if (!selectedBranch) return alert("Pilih cabang mitra terlebih dahulu!");

        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goods`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`,
                },
                body: JSON.stringify({
                    vendorBranchId: selectedBranch,
                    categoryId,
                    name,
                    quantity,
                    dateIn,
                    dateOut,
                    paymentMethod,
                    bank,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) throw new Error(data.message || "Gagal menambahkan barang");

            alert("Barang berhasil dititipkan!");


            setName("");
            setQuantity(1);
            setDateIn(undefined);
            setDateOut(undefined);
            setPaymentMethod("");
            setBank("");
            setSelectedBranch("");
            setOpen(false);
        } catch (error) {
            console.error("Error detail:", error);
            alert("Terjadi kesalahan saat menambahkan barang");


            setName("");
            setQuantity(1);
            setDateIn(undefined);
            setDateOut(undefined);
            setPaymentMethod("");
            setBank("");
            setSelectedBranch("");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className='pb-16'>
            <Header />
            <main className='p-4'>
                <Tabs defaultValue="mitra" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="mitra">Mitra</TabsTrigger>
                        <TabsTrigger value="titipan">Titipan</TabsTrigger>
                    </TabsList>

                    <TabsContent value="mitra">
                        <div className='max-h-96 overflow-y-auto'>
                            {vendorBranch.map((branch) => (
                                <div key={branch.id} className="border-b border-gray-200 p-4">
                                    <h2 className="text-lg font-semibold">{branch.name}</h2>
                                    <p className="text-gray-600 flex items-center"><MapPin className="mr-2 h-4 w-4" />{branch.address}</p>
                                    <p className="text-gray-600 flex items-center"><PhoneCallIcon className="mr-2 h-4 w-4" />{branch.phone}</p>
                                    <Button
                                        className='w-1/2 mt-2'
                                        onClick={() => {
                                            setSelectedBranch(branch.id)
                                            setOpen(true)
                                        }}
                                    >
                                        Titip Sini
                                    </Button>
                                </div>
                            ))}
                        </div>

                    </TabsContent>

                    <TabsContent value="titipan">
                        <div className='max-h-96 overflow-y-auto'>
                            {goods.length > 0 ? (
                                goods.map((good) => (
                                    <div
                                        key={good.id}
                                        className="border border-gray-200 rounded-xl p-4 mb-3 grid grid-cols-2 md:grid-cols-3 gap-3 bg-white shadow-sm"
                                    >
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800">{good.name}</h2>
                                            <p className="text-sm text-gray-600">Jumlah: {good.quantity}</p>
                                            <p className="text-sm text-gray-600">Durasi: {good.dayTotal} hari</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600">Masuk: {good.dateIn}</p>
                                            <p className="text-sm text-gray-600">Keluar: {good.dateOut}</p>
                                        </div>

                                        <div className="flex flex-col justify-center">
                                            <span className="font-medium text-gray-700">
                                                Metode: {good.paymentMethod}
                                            </span>

                                            {good.paymentMethod === "transfer" && (
                                                <span className="text-sm text-gray-600">Bank: {good.bank}</span>
                                            )}

                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg mt-2 text-sm font-semibold text-right">
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                    minimumFractionDigits: 0,
                                                }).format(good.totalPrice)}
                                            </span>
                                        </div>
                                    </div>

                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">
                                    Anda belum punya order titip.
                                </p>
                            )}
                        </div>

                    </TabsContent>

                </Tabs>
            </main>

            <Navbar />

            {/* --- Dialog Tambah Titipan --- */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tambah Titipan Barang</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div>
                            <Label>Nama Barang</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Contoh: Laptop"
                            />
                        </div>

                        <div>
                            <Label>Kategori</Label>
                            <Select onValueChange={setCategoryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    {category.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Jumlah</Label>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                placeholder="Contoh: 1"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <Label>Tanggal Masuk</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateIn ? format(dateIn, 'PPP', { locale: id }) : "Pilih tanggal"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="p-0">
                                        <Calendar mode="single" selected={dateIn} onSelect={setDateIn} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="flex-1">
                                <Label>Tanggal Keluar</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dateOut ? format(dateOut, 'PPP', { locale: id }) : "Pilih tanggal"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent align="start" className="p-0">
                                        <Calendar mode="single" selected={dateOut} onSelect={setDateOut} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div>
                            <Label>Metode Pembayaran</Label>
                            <Select
                                value={paymentMethod}
                                onValueChange={(value) => setPaymentMethod(value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih metode pembayaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="transfer">Transfer</SelectItem>
                                    {/* <SelectItem value="cash">Cash</SelectItem> */}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Hanya tampil jika metode = transfer */}
                        {paymentMethod === "transfer" && (
                            <div>
                                <Label>Bank</Label>
                                <Select
                                    value={bank}
                                    onValueChange={(value) => setBank(value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih bank" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bca">BCA</SelectItem>
                                        <SelectItem value="mandiri">Mandiri</SelectItem>
                                        <SelectItem value="bri">BRI</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={handleCreateGoods} disabled={loading}>
                            {loading ? <LoadingSpinner /> : "Titip"}
                        </Button>

                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
