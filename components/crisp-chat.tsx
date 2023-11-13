"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("020feb38-6c85-43d6-b9d4-c9902e490717");
  }, []);

  return null;
};