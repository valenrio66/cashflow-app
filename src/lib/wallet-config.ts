type WalletUIConfig = {
  color: string;
  logoUrl: string;
};

export const getWalletUI = (name: string): WalletUIConfig => {
  const lower = name.toLowerCase();

  if (lower.includes("bri")) {
    return {
      color: "from-blue-600 to-blue-800",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/2/2e/BRI_2020.svg",
    };
  }
  if (lower.includes("jago")) {
    return {
      color: "from-amber-500 to-orange-600",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/4/48/Bank_Jago_2026.svg",
    };
  }
  if (lower.includes("wondr") || lower.includes("bni")) {
    return {
      color: "from-teal-600 to-cyan-700",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/f/f0/Bank_Negara_Indonesia_logo_%282004%29.svg",
    };
  }
  if (lower.includes("raya")) {
    return {
      color: "from-blue-700 to-indigo-900",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/4/49/Bank_Raya_2023.svg",
    };
  }
  if (lower.includes("seabank")) {
    return {
      color: "from-orange-500 to-rose-500",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/a/ac/SeaBank.svg",
    };
  }

  if (lower.includes("dana")) {
    return {
      color: "from-blue-400 to-sky-600",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg",
    };
  }
  if (lower.includes("gopay")) {
    return {
      color: "from-cyan-500 to-blue-600",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg",
    };
  }
  if (lower.includes("shopee")) {
    return {
      color: "from-orange-500 to-orange-600",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopee_logo.svg",
    };
  }

  if (lower.includes("bibit")) {
    return {
      color: "from-emerald-500 to-teal-600",
      logoUrl:
        "https://bibit.id/_next/static/media/logo-bibit.01047z1c09~gi.svg",
    };
  }
  if (lower.includes("tring") || lower.includes("pegadaian")) {
    return {
      color: "from-emerald-600 to-emerald-800",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/c/ce/TRING_by_Pegadaian.svg",
    };
  }

  return {
    color: "from-slate-600 to-slate-800",
    logoUrl: "",
  };
};
