"use client";

import RootLayout from "@/components/layout/RootLayout";

export default function ContactPage() {
    return (
        <RootLayout>
            <div className="bg-gray-50 py-12">
                <div className="container">
                    <h1 className="mb-8 text-3xl font-bold">যোগাযোগ করুন</h1>

                    <div className="prose prose-gray max-w-none rounded-lg bg-white p-8">
                        <h2 className="text-xl font-semibold">অফিস ঠিকানা</h2>
                        <p>দেশি ফ্রেশ বাজার<br />
                            বাড়ি #১২৩, রোড #০৪<br />
                            ধানমন্ডি, ঢাকা-১২০৯<br />
                            বাংলাদেশ</p>

                        <h2 className="mt-8 text-xl font-semibold">যোগাযোগের মাধ্যম</h2>
                        <ul className="list-disc pl-6">
                            <li>ফোন: ০১৭১২ ৩৪৫৬৭৮</li>
                            <li>হটলাইন: ১৬২৪৭</li>
                            <li>ইমেইল: info@deshifreshbazar.com</li>
                            <li>ওয়েবসাইট: www.deshifreshbazar.com</li>
                        </ul>

                        <h2 className="mt-8 text-xl font-semibold">কার্যালয়ের সময়</h2>
                        <ul className="list-disc pl-6">
                            <li>রবিবার - বৃহস্পতিবার: সকাল ৯টা - রাত ৮টা</li>
                            <li>শুক্রবার: সকাল ১০টা - বিকাল ৫টা</li>
                            <li>শনিবার: সকাল ১০টা - রাত ৮টা</li>
                        </ul>

                        <h2 className="mt-8 text-xl font-semibold">অভিযোগ ও পরামর্শ</h2>
                        <p>আপনার কোন অভিযোগ বা পরামর্শ থাকলে আমাদের ইমেইল করুন: complaints@deshifreshbazar.com</p>

                        <h2 className="mt-8 text-xl font-semibold">সামাজিক যোগাযোগ মাধ্যম</h2>
                        <ul className="list-disc pl-6">
                            <li>
                                <a href="https://www.instagram.com/deshi_fresh_bazar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                    ইনস্টাগ্রাম: deshi_fresh_bazar
                                </a>
                            </li>
                            <li>
                                <a href="https://www.tiktok.com/@deshi.fresh.bazar" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                    টিকটক: deshi.fresh.bazar
                                </a>
                            </li>
                            <li>
                                <a href="https://api.whatsapp.com/send/?phone=8801560001192" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                    হোয়াটসঅ্যাপ: +৮৮০১৫৬০০০১১৯২
                                </a>
                            </li>
                        </ul>
                        <h2 className="mt-8 text-xl font-semibold">ডেলিভারি এলাকা: বাংলাদেশ</h2>
                        <p>আমাদের পণ্য/সেবা বর্তমানে বাংলাদেশের যেকোনো স্থানে ডেলিভারি সুবিধা সহ উপলব্ধ। আপনি দেশের যেকোনো প্রান্তে অবস্থান করলেও আমরা আপনাকে সময়মতো ও নিরাপদভাবে পণ্য পৌঁছে দেবার নিশ্চয়তা দিচ্ছি।</p>
                        
                        <ul className="list-none space-y-1 mt-4">
                            <li className="flex items-center">
                                <span className="text-green-600 mr-2">✅</span>
                                ঢাকা, চট্টগ্রাম, রাজশাহী, খুলনা, সিলেট, বরিশাল, রংপুর, ময়মনসিংহসহ সকল বিভাগীয় ও জেলা শহর
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-600 mr-2">✅</span>
                                উপজেলা ও ইউনিয়ন পর্যায়েও ডেলিভারি
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-600 mr-2">✅</span>
                                কুরিয়ার সার্ভিসের মাধ্যমে দ্রুত ও নির্ভরযোগ্য সরবরাহ
                            </li>
                            <li className="flex items-center">
                                <span className="text-green-600 mr-2">✅</span>
                                ক্যাশ অন ডেলিভারি (COD) ও অনলাইন পেমেন্ট সাপোর্ট
                            </li>
                        </ul>

                        <p className="mt-4">আপনার ঠিকানা অনুযায়ী ডেলিভারির সময় ও চার্জ আলাদা হতে পারে। অর্ডার করার সময় দয়া করে সঠিক ঠিকানা প্রদান করুন।</p>

                        <h2 className="mt-8 text-xl font-semibold">কর্পোরেট অফিস</h2>
                        <p>কর্পোরেট অর্ডার বা চুক্তির জন্য যোগাযোগ করুন:<br />
                            ফোন: +৮৮০ ১৮১২ ৩৪৫৬৭৮<br />
                            ইমেইল: deshifreshbazar@gmail.com</p>
                    </div>
                </div>
            </div>
        </RootLayout>
    );
}