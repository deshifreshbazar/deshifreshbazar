"use client";

import RootLayout from "@/components/layout/RootLayout";

export default function ReturnPolicyPage() {
  return (
    <RootLayout>
      <div className="bg-gray-50 py-12">
        <div className="container">
          <h1 className="mb-8 text-3xl font-bold">রিটার্ন নীতিমালা</h1>
          
          <div className="prose prose-gray max-w-none rounded-lg bg-white p-8">
            <h2 className="text-xl font-semibold">১. রিটার্ন যোগ্য পণ্য</h2>
            <p>নিম্নলিখিত ক্ষেত্রে পণ্য ফেরত নেওয়া হয়:</p>
            <ul className="list-disc pl-6">
              <li>পণ্য ক্ষতিগ্রস্ত অবস্থায় ডেলিভারি হলে</li>
              <li>ভুল পণ্য ডেলিভারি হলে</li>
              <li>পণ্যের মান সন্তোষজনক না হলে</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">২. রিটার্নের সময়সীমা</h2>
            <p>ডেলিভারির ২৪ ঘণ্টার মধ্যে অভিযোগ জানাতে হবে। এর পরে কোন অভিযোগ গ্রহণ করা হবে না।</p>

            <h2 className="mt-8 text-xl font-semibold">৩. রিটার্ন প্রক্রিয়া</h2>
            <ol className="list-decimal pl-6">
              <li>হটলাইন নম্বরে কল করে অভিযোগ জানান</li>
              <li>পণ্যের ছবি তুলে পাঠান</li>
              <li>আমাদের প্রতিনিধি পরিদর্শন করবেন</li>
              <li>অভিযোগ যথাযথ হলে পণ্য ফেরত নেওয়া হবে</li>
            </ol>

            <h2 className="mt-8 text-xl font-semibold">৪. রিফান্ড নীতি</h2>
            <p>পণ্য ফেরত নেওয়ার পর:</p>
            <ul className="list-disc pl-6">
              <li>নতুন পণ্য দেওয়া হবে অথবা</li>
              <li>সম্পূর্ণ টাকা ফেরত দেওয়া হবে</li>
              <li>রিফান্ড ৭২ ঘণ্টার মধ্যে প্রদান করা হবে</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">৫. বিশেষ শর্তাবলী</h2>
            <ul className="list-disc pl-6">
              <li>পণ্য ব্যবহার করা হলে ফেরত নেওয়া হবে না</li>
              <li>প্যাকেজিং ক্ষতিগ্রস্ত হলে পণ্য পরীক্ষা করে নিন</li>
              <li>ডেলিভারি ম্যানের সামনে পণ্য পরীক্ষা করার সুযোগ রয়েছে</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold">৬. যোগাযোগ</h2>
            <p>রিটার্ন সংক্রান্ত যেকোনো তথ্যের জন্য কল করুন: ০১৭৮২২৮৫১৭১</p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}