import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Header from "@/components/shared/Header";
import TransformationForm from "@/components/shared/TransformationForm";
import { transformationTypes } from "../../../../../../constants";
import { getUserById } from "@/lib/actions/user.action";
import { getImageById } from "@/lib/actions/image.action";
import { useRouter } from "next/router";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const Page = async ({ params }: PageProps) => {
    const { userId } = await auth();
    // const paramstype = await params;

    if (!userId) redirect("/sign-in");

    const user = await getUserById(userId);
    const param = await params;
    const image = await getImageById(param?.id);

    const transformation =
        transformationTypes[image.transformationType as TransformationTypeKey];

    return (
        <>
            <Header
                title={transformation.title}
                subTitle={transformation.subTitle}
            />

            <section className="mt-10">
                <TransformationForm
                    action="Update"
                    userId={user._id}
                    type={image.transformationType as TransformationTypeKey}
                    creditBalance={user.creditBalance}
                    config={image.config}
                    data={image}
                />
            </section>
        </>
    );
};

export default Page;
