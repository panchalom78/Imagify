import React from "react";
import Header from "../../../../../components/shared/Header";
import { transformationTypes } from "../../../../../../constants";
import TransformationForm from "../../../../../components/shared/TransformationForm";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";

interface TransformationsAddPageProps {
    params: {
        type: string;
    };
}

const TransformationsAddPage = async ({
    params,
}: TransformationsAddPageProps) => {
    const transformation =
        transformationTypes[params?.type as TransformationTypeKey];
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }
    const user = await getUserById(userId);
    return (
        <>
            <Header
                title={transformation.title}
                subTitle={transformation.subTitle}
            />

            <section className="mt-10">
                <TransformationForm
                    action="Add"
                    userId={user._id}
                    type={transformation.type as TransformationTypeKey}
                    creditBalance={user.creditBalance}
                />
            </section>
        </>
    );
};

export default TransformationsAddPage;
