'use client'

import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'vendor' | 'customer'>('customer');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const [regLoading, setRegLoading] = useState(false);
  const router = useRouter();

  // --- Handle Register ---
  const handleSubmit = async (e: React.FormEvent) => {
    setRegLoading(true);
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Password tidak sama");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          address,
          phone,
          role,
          password,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Register failed:", errText);
        setError("Gagal mendaftar. Periksa input Anda.");
        return;
      }

      // Jika role adalah vendor, lanjutkan buat vendor profile
      if (role === "vendor") {
        const success = await login(email, password);
        if (success) {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vendor`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("titipsini_token")}`,
              },
              body: JSON.stringify({
                companyName,
                companyAddress,
              }),
            });

            if (!res.ok) {
              const errText = await res.text();
              console.error("Create vendor failed:", errText);
              setError("Gagal membuat vendor. Periksa input Anda.");
              return;
            }

            alert("Vendor berhasil dibuat!");
            router.push("/profile");
          } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan saat membuat vendor.");
          }
        }
      } else {
        // Jika customer
        alert("Registrasi customer berhasil! Silakan login.");
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan saat registrasi.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full md:w-[700px] max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Image
              src="/logotitipsini.png"
              alt="Titipsini Logo"
              width={80}
              height={80}
              className="mx-auto"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Titipsini</CardTitle>
          <CardDescription>Buat akun baru untuk menggunakan layanan</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Daftar sebagai</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={role === "customer" ? "default" : "outline"}
                  onClick={() => setRole("customer")}
                >
                  Customer
                </Button>
                <Button
                  type="button"
                  variant={role === "vendor" ? "default" : "outline"}
                  onClick={() => setRole("vendor")}
                >
                  Vendor
                </Button>
              </div>
            </div>

            {/* Common fields */}
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input
                id="address"
                placeholder="Masukkan alamat"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                placeholder="08xxxxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Vendor fields */}
            {role === "vendor" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nama Perusahaan</Label>
                  <Input
                    id="companyName"
                    placeholder="Masukkan nama perusahaan"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyAddress">Alamat Perusahaan</Label>
                  <Input
                    id="companyAddress"
                    placeholder="Masukkan alamat perusahaan"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm text-center">{error}</div>}

            <Button
              type="submit"
              className="w-full green-gradient hover:opacity-90"
              disabled={regLoading}
            >
              {regLoading ? "Memproses..." : "Daftar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
