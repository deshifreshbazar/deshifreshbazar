'use client';

import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ProfilePage() {
  const { user } = useUser();

  if (!user) {
    return (
      <>
        <Header />
        <div className="container py-8">Please log in to view your profile.</div>
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
            <div className="space-y-4">
              <div>
                <label className="font-medium">Name:</label>
                <p>{user.name}</p>
              </div>
              <div>
                <label className="font-medium">Email:</label>
                <p>{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}