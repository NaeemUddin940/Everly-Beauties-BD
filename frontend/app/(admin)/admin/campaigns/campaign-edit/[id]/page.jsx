"use client";

import React from "react";
import AddNewCampaigns from "../../add-new-campaigns/page";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-toastify";

const CampaignEditPage = () => {
    const { id } = useParams();
    const router = useRouter();

    const { data: campaign } = useQuery({
        queryKey: ["campaign", id],
        queryFn: async () => {
            if (!id) throw new Error("Invalid campaign ID");

            const { data } = await axiosInstance.get(`/campaigns/${id}`);

            if (!data || !data._id) {
                throw new Error("Campaign not found");
            }

            return data;
        },
        enabled: !!id,
        retry: false,
        onError: (err) => {
            console.error("Fetch campaign error:", err);
            toast.error(err.message || "Failed to fetch campaign data.");
            router.push("/admin-dashboard/campaigns");
        },
    });

    return <AddNewCampaigns campaign={campaign} isEditMode={true} />;
};

export default CampaignEditPage;
