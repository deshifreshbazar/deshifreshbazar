'use client';

import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { normalizeImageUrl } from '@/lib/supabase-storage';

export default function ProfilePage() {
  const { user } = useUser();
  const profileImage = normalizeImageUrl(user?.image);

  if (!user) {
    return (
      <>
        <Header />
        <div className="container py-8 text-center">
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
                <Link href="/login">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Go to Login
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center border-4 border-gray-200 shadow-lg">
                    <span className="text-gray-600 text-2xl font-bold">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-gray-700">Name:</label>
                  <p className="text-gray-900 mt-1">{user.name}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Email:</label>
                  <p className="text-gray-900 mt-1">{user.email}</p>
                </div>
                <div>
                  <label className="font-medium text-gray-700">Role:</label>
                  <p className="text-gray-900 mt-1 capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
