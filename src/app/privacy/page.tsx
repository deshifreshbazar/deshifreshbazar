"use client";

import RootLayout from "@/components/layout/RootLayout";

export default function PrivacyPage() {
  return (
    <RootLayout>
      <div className="bg-gray-50 py-12">
        <div className="container">
          <h1 className="mb-8 text-3xl font-bold">গোপনীয়তা নীতি</h1>
          
          <div className="prose prose-gray max-w-none rounded-lg bg-white p-8">
            <h2 className="text-xl font-semibold">১. তথ্য সংগ্রহ</h2>
            <p>আমরা নিম্নলিখিত তথ্য সংগ্রহ করি:</p>
            <ul className="list-disc pl-6">
              <li>নাম, ঠিকানা, ফোন নম্বর, ইমেইল</li>
              <li>অর্ডার এবং পেমেন্ট সংক্রান্ত তথ্য</li>
              <li>ওয়েবসাইট ব্যবহারের তথ্য</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">২. তথ্য ব্যবহার</h2>
            <p>সংগৃহীত তথ্য নিম্নলিখিত কাজে ব্যবহার করা হয়:</p>
            <ul className="list-disc pl-6">
              <li>অর্ডার প্রসেস করা</li>
              <li>ডেলিভারি সেবা প্রদান</li>
              <li>গ্রাহক সেবা উন্নত করা</li>
              <li>নতুন অফার সম্পর্কে অবহিত করা</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">৩. তথ্য সুরক্ষা</h2>
            <p>আপনার তথ্য সুরক্ষার জন্য আমরা:</p>
            <ul className="list-disc pl-6">
              <li>SSL এনক্রিপশন ব্যবহার করি</li>
              <li>নিয়মিত সিস্টেম আপডেট করি</li>
              <li>শক্তিশালী পাসওয়ার্ড নীতি অনুসরণ করি</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">৪. তৃতীয় পক্ষের সাথে তথ্য শেয়ার</h2>
            <p>আমরা নিম্নলিখিত ক্ষেত্রে তথ্য শেয়ার করি:</p>
            <ul className="list-disc pl-6">
              <li>ডেলিভারি পার্টনারদের সাথে</li>
              <li>পেমেন্ট প্রসেসরদের সাথে</li>
              <li>আইনি বাধ্যবাধকতার ক্ষেত্রে</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">৫. কুকি নীতি</h2>
            <p>আমাদের ওয়েবসাইট কুকি ব্যবহার করে। এটি বন্ধ করা যাবে ব্রাউজার সেটিংস থেকে।</p>

            <h2 className="mt-8 text-xl font-semibold">৬. পরিবর্তন</h2>
            <p>এই নীতিমালা যেকোনো সময় পরিবর্তন হতে পারে। পরিবর্তন করা হলে ওয়েবসাইটে আপডেট করা হবে।</p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}