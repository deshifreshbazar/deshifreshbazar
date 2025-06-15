"use client";

import RootLayout from "@/components/layout/RootLayout";

export default function TermsPage() {
  return (
    <RootLayout>
      <div className="bg-gray-50 py-12">
        <div className="container">
          <h1 className="mb-8 text-3xl font-bold">শর্তাবলী</h1>
          
          <div className="prose prose-gray max-w-none rounded-lg bg-white p-8">
            <h2 className="text-xl font-semibold">১. সাধারণ শর্তাবলী</h2>
            <p>দেশি ফ্রেশ বাজার ওয়েবসাইট ব্যবহার করে আপনি নিম্নলিখিত শর্তাবলী মেনে চলতে সম্মত হচ্ছেন। এই শর্তাবলী যেকোনো সময় পরিবর্তন হতে পারে।</p>

            <h2 className="mt-8 text-xl font-semibold">২. অ্যাকাউন্ট নিবন্ধন</h2>
            <p>অ্যাকাউন্ট তৈরি করার সময় সঠিক তথ্য প্রদান করতে হবে। ভুল তথ্য প্রদান করলে অ্যাকাউন্ট বাতিল করা হতে পারে।</p>

            <h2 className="mt-8 text-xl font-semibold">৩. মূল্য এবং পেমেন্ট</h2>
            <ul className="list-disc pl-6">
              <li>সকল মূল্য বাংলাদেশি টাকায় প্রদর্শিত হয়</li>
              <li>মূল্য যেকোনো সময় পরিবর্তন হতে পারে</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">৪. ডেলিভারি নীতিমালা</h2>
            <ul className="list-disc pl-6">
              <li>ঢাকা সিটিতে ২৪ ঘণ্টার মধ্যে ডেলিভারি করা হয়</li>
              <li>অন্যান্য জেলায় ২-৩ দিন সময় লাগতে পারে</li>
              <li>প্রাকৃতিক দুর্যোগের কারণে ডেলিভারি বিলম্বিত হতে পারে</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">৫. পণ্যের গুণগত মান</h2>
            <p>আমরা সর্বোচ্চ মানের পণ্য সরবরাহ করার চেষ্টা করি। তবে প্রাকৃতিক পণ্যের ক্ষেত্রে সামান্য পার্থক্য থাকতে পারে।</p>

            <h2 className="mt-8 text-xl font-semibold">৬. ক্যান্সেলেশন নীতি</h2>
            <p>ডেলিভারি শুরু হওয়ার আগে অর্ডার ক্যান্সেল করা যাবে। ডেলিভারি শুরু হয়ে গেলে ক্যান্সেলেশন সম্ভব নয়।</p>

            <h2 className="mt-8 text-xl font-semibold">৭. বিবাদ নিষ্পত্তি</h2>
            <p>যেকোনো বিবাদ বাংলাদেশের আইন অনুযায়ী নিষ্পত্তি করা হবে।</p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}