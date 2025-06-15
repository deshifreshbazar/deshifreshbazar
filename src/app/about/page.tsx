"use client";

import RootLayout from "@/components/layout/RootLayout";

export default function AboutPage() {
  return (
    <RootLayout>
      <div className="bg-gray-50 py-12">
        <div className="container">
          <h1 className="mb-8 text-3xl font-bold">আমাদের সম্পর্কে</h1>
          
          <div className="prose prose-gray max-w-none rounded-lg bg-white p-8">
            <h2 className="text-xl font-semibold">আমাদের পরিচয়</h2>
            <p>দেশি ফ্রেশ বাজার বাংলাদেশের অন্যতম শীর্ষস্থানীয় অনলাইন ফলের বাজার। ২০১৮ সাল থেকে আমরা গ্রাহকদের সেরা মানের তাজা ফল সরবরাহ করে আসছি। আমাদের লক্ষ্য হল গ্রাহকদের দরজায় সর্বোচ্চ মানের ফল পৌঁছে দেওয়া।</p>

            <h2 className="mt-8 text-xl font-semibold">আমাদের লক্ষ্য</h2>
            <ul className="list-disc pl-6">
              <li>সর্বোচ্চ মানের তাজা ফল সরবরাহ করা</li>
              <li>গ্রাহক সন্তুষ্টি নিশ্চিত করা</li>
              <li>দ্রুত ও নির্ভরযোগ্য ডেলিভারি সেবা প্রদান</li>
              <li>কৃষকদের সাথে সরাসরি সম্পর্ক স্থাপন</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">আমাদের অর্জন</h2>
            <ul className="list-disc pl-6">
              <li>১০,০০০+ সন্তুষ্ট গ্রাহক</li>
              <li>৫০+ জেলায় ডেলিভারি নেটওয়ার্ক</li>
              <li>১০০+ কৃষকের সাথে সরাসরি চুক্তি</li>
              <li>বাৎসরিক ২০০+ টন ফল সরবরাহ</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">মান নিয়ন্ত্রণ</h2>
            <p>আমাদের রয়েছে একটি বিশেষজ্ঞ টিম যারা প্রতিটি ফলের গুণগত মান যাচাই করে। আমরা শুধুমাত্র নির্বাচিত কৃষকদের কাছ থেকে ফল সংগ্রহ করি এবং প্রতিটি ধাপে মান নিয়ন্ত্রণ করি।</p>

            <h2 className="mt-8 text-xl font-semibold">সামাজিক দায়বদ্ধতা</h2>
            <p>আমরা কৃষকদের উন্নয়নে কাজ করি। তাদের উৎপাদিত ফলের ন্যায্য মূল্য নিশ্চিত করি এবং আধুনিক কৃষি পদ্ধতি সম্পর্কে প্রশিক্ষণ প্রদান করি।</p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}