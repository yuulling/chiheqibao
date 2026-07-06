import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 创建默认管理员
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: {},
    create: {
      username,
      password: hashedPassword,
    },
  });
  console.log(`Admin user created: ${username}`);

  // 创建示例分类
  const categories = [
    { name: "举升机", slug: "lifting-machine", description: "各类汽车举升设备", sortOrder: 1 },
    { name: "拆胎机", slug: "tire-changer", description: "轮胎拆装设备", sortOrder: 2 },
    { name: "平衡机", slug: "wheel-balancer", description: "车轮平衡检测设备", sortOrder: 3 },
    { name: "加高腿及配件", slug: "extended-legs", description: "举升机加高腿及相关配件", sortOrder: 4 },
    { name: "四轮定位仪", slug: "wheel-aligner", description: "四轮定位检测设备", sortOrder: 5 },
    { name: "烤漆房", slug: "spray-booth", description: "汽车喷漆烤漆设备", sortOrder: 6 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`Created ${categories.length} categories`);

  // 创建示例产品
  const products = [
    {
      name: "双柱举升机 S-30A",
      slug: "two-post-lift-s30a",
      description: "专业双柱液压举升机，适用于各类轿车、SUV的维修保养。采用高强度钢材制造，安全可靠。",
      specs: JSON.stringify([
        { label: "举升重量", value: "3.0 吨" },
        { label: "举升高度", value: "1800mm" },
        { label: "立柱高度", value: "2800mm" },
        { label: "电机功率", value: "2.2KW" },
        { label: "电压", value: "380V/220V" },
      ]),
      price: 8500,
      unit: "台",
      featured: true,
      categorySlug: "lifting-machine",
      sortOrder: 1,
    },
    {
      name: "四柱举升机 S-40B",
      slug: "four-post-lift-s40b",
      description: "重型四柱举升机，适合大型SUV、商务车及轻型卡车。结构稳固，操作便捷。",
      specs: JSON.stringify([
        { label: "举升重量", value: "4.0 吨" },
        { label: "举升高度", value: "1750mm" },
        { label: "平台长度", value: "4500mm" },
        { label: "电机功率", value: "2.2KW" },
        { label: "电压", value: "380V" },
      ]),
      price: 12800,
      unit: "台",
      featured: true,
      categorySlug: "lifting-machine",
      sortOrder: 2,
    },
    {
      name: "全自动拆胎机 T-668",
      slug: "tire-changer-t668",
      description: "全自动轮胎拆装机，适用于10-24寸轮胎。大扭矩电机，操作简单高效。",
      specs: JSON.stringify([
        { label: "适用轮毂", value: "10-24寸" },
        { label: "最大轮胎宽度", value: "360mm" },
        { label: "工作气压", value: "8-10bar" },
        { label: "电机功率", value: "1.1KW" },
      ]),
      price: 5800,
      unit: "台",
      featured: true,
      categorySlug: "tire-changer",
      sortOrder: 1,
    },
    {
      name: "车轮平衡机 B-200",
      slug: "wheel-balancer-b200",
      description: "高精度电脑车轮平衡机，自动测量、自动定位，精度可达±1g。",
      specs: JSON.stringify([
        { label: "最大轮重", value: "65kg" },
        { label: "轮毂直径", value: "10-24寸" },
        { label: "测量精度", value: "±1g" },
        { label: "电机功率", value: "0.25KW" },
        { label: "平衡转速", value: "200rpm" },
      ]),
      price: 4200,
      unit: "台",
      featured: false,
      categorySlug: "wheel-balancer",
      sortOrder: 1,
    },
    {
      name: "举升机加高腿套件",
      slug: "extended-legs-kit",
      description: "双柱举升机加高腿套件，适配主流举升机型号。增加举升高度200mm，满足特殊车型需求。",
      specs: JSON.stringify([
        { label: "增高尺寸", value: "200mm" },
        { label: "适配机型", value: "双柱举升机通用" },
        { label: "材质", value: "高强度钢" },
        { label: "承重", value: "3-4吨" },
      ]),
      price: 1800,
      unit: "套",
      featured: true,
      categorySlug: "extended-legs",
      sortOrder: 1,
    },
    {
      name: "3D四轮定位仪 A-800",
      slug: "3d-wheel-aligner-a800",
      description: "3D影像四轮定位仪，高精度测量，自动识别车型数据，操作直观。",
      specs: JSON.stringify([
        { label: "测量精度", value: "±0.02°" },
        { label: "相机分辨率", value: "500万像素" },
        { label: "适用车型", value: "轿车/SUV/MPV" },
        { label: "数据库", value: "50000+车型数据" },
      ]),
      price: 25800,
      unit: "套",
      featured: false,
      categorySlug: "wheel-aligner",
      sortOrder: 1,
    },
  ];

  for (const product of products) {
    const { categorySlug, ...productData } = product;
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: {
        ...productData,
        categoryId: category?.id || null,
      },
    });
  }
  console.log(`Created ${products.length} products`);

  // 创建默认设置
  const settings = [
    { key: "siteName", value: "赤赫汽保工具" },
    { key: "siteDescription", value: "专业汽保设备供应商" },
    { key: "companyName", value: "赤赫汽保设备有限公司" },
    { key: "companyAddress", value: "请输入公司地址" },
    { key: "companyPhone", value: "请输入联系电话" },
    { key: "companyEmail", value: "请输入联系邮箱" },
    { key: "homeBannerTitle", value: "专业汽保设备供应商" },
    { key: "homeBannerSubtitle", value: "品质设备，专业服务，让您的汽修事业更高效" },
    { key: "aboutContent", value: "<p>我们是一家专业从事汽保设备销售与服务的公司，拥有多年的行业经验。</p><p>主营产品包括举升机、拆胎机、平衡机、四轮定位仪等各类汽保设备及配件。</p><p>我们坚持品质至上、服务为本的经营理念，为客户提供优质的设备和完善的售后服务。</p>" },
    { key: "footerText", value: "© 2024 赤赫汽保工具. All rights reserved." },
    { key: "icpNumber", value: "" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log(`Created ${settings.length} settings`);

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
