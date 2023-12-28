'use client'
import { NextPage } from "next";
import dynamic from "next/dynamic";
const AdminApp = dynamic(async () => import("./components/AdminApp"), { ssr: false });

const Home: NextPage = () => <AdminApp />;

export default Home;