import Link from "next/link";
import { navLinks } from "../../../constants";
import Image from "next/image";
import { Collection } from "@/components/shared/Collections";
import { getAllImages } from "@/lib/actions/image.action";
import { useSearchParams } from "next/navigation";

interface HomeProps {
    params: {
        page: string;
        query: string;
    };
}

const Home = async ({ params }: HomeProps) => {
    const page = Number(params?.page) || 1;
    const searchQuery = params?.query || "";

    const images = await getAllImages({ page, searchQuery });
    return (
        <>
            <section className="home">
                <h1 className="home-heading">
                    Unleash Your Creative Vision with Imagify
                </h1>
                <ul className="flex-center w-full gap-20">
                    {navLinks.slice(1, 5).map((link) => (
                        <Link
                            key={link.route}
                            href={link.route}
                            className="flex-center flex-col gap-2"
                        >
                            <li className="flex-center w-fit rounded-full p-4 bg-white">
                                <Image
                                    src={link.icon}
                                    alt="image"
                                    height={24}
                                    width={24}
                                />
                            </li>
                            <p>{link.label}</p>
                        </Link>
                    ))}
                </ul>
            </section>
            <section className="sm:mt-12">
                <Collection
                    hasSearch={true}
                    images={images?.data}
                    totalPages={images?.totalPages}
                    page={page}
                />
            </section>
        </>
    );
};

export default Home;
