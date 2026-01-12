import { fetchCryptoList } from "@/services/api";
import { redirect } from "next/navigation";

export default async function Home() {
  const cryptoList = await fetchCryptoList();
  const firstCrypto = cryptoList[0]?.id || 'bitcoin';
  redirect(`/crypto/${firstCrypto}`);
}
