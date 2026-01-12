export default async function CryptoDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    console.log("params", id);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Crypto Details</h1>
            <p>Viewing cryptocurrency: {id}</p>
        </div>
    );
}
