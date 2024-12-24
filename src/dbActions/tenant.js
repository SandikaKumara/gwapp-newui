"use server";

import prisma from "@/lib/db";
import { fileUpload, getFile, uploadFileNew } from "@/lib/files";
import { revalidatePath } from "next/cache";

export async function getTenantAction(id) {
  try {
    const tenant = await prisma.Tenant.findUnique({
      where: {
        id: id,
      }
    })
    return tenant
  } catch (err) {
    // console.log(err);

    return { type: 'error', message: `Error while fetching the Tenant. : ${err}` }
  }
}

export async function getTenantListAction(searchText, isActive) {
  try {
    const tenants = await prisma.Tenant.findMany({
      where: {
        name: {
          contains: searchText
        },
        ...(isActive && {
          AND: {
            isActive: isActive
          }
        }
        )
      }
    })

    const tenantsWithLogos = [];

    if (tenants) {
      for (const tenant of tenants) {
        let file;
        if (tenant?.logoPath && tenant?.logoPath !== null) {
          file = await getFile(tenant?.logoPath);
        }

        tenantsWithLogos.push({
          ...tenant,  // Spread the existing tenant information
          logoFile: file?.image || "" // Add the fetched logo file to the tenant object
        });
      }

      // console.log(tenantsWithLogos); // List of tenants with appended logo files
    }


    return tenantsWithLogos

  } catch (err) {
    // console.log(err);

    return { type: 'error', message: `Error while fetching the Tenant list. : ${err}` }
  }
}


export async function createTenantAction(formData) {

  const name = formData.get("name");
  const contact = formData.get("contact");
  const address = formData.get("address");
  const clientId = formData.get("clientId");
  const secretKey = formData.get("secretKey");
  const homeUrl = formData.get("homeUrl");
  const mobileUrl = formData.get("mobileUrl");
  // const bgColor = formData.get("bgColor");
  // const textColor = formData.get("textColor");
  // const textHoverColor = formData.get("textHoverColor");
  // const borderColor = formData.get("borderColor");
  // const categoryTextColor = formData.get("textCategoryColor");
  const imagePath = formData.get("imagePath");
  const file = formData.get("logoPath")

  console.log("imagePath", imagePath);
  console.log("file", file);


  // handle File Upload
  let logoPath;
  let newFileName;


  try {
    const existingTenant = await prisma.Tenant.findUnique({
      where: {
        name: name,
      },
    });

    if (existingTenant) {
      return { type: 'warning', message: `Tenant is exists with the name : , ${name}` }
    }

    const updateData = {
      name,
      contact,
      address,
      clientId,
      secretKey,
      homeUrl,
      mobileUrl,
      logoPath,
      // bgColor,
      // textColor,
      // textHoverColor,
      // borderColor,
      // categoryTextColor,
      ...(logoPath && { logoPath }) // Only include logoPath if it's defined
    };

    const result = await prisma.Tenant.create({
      data: updateData,
    });


    if (file && file.name && file.name !== 'undefined') {
      newFileName = result.id + '_' + file.name;
      logoPath = '/img/' + newFileName;
    }

    if (logoPath) {
      const fileUploadRes = await uploadFileNew(file, newFileName, "img")
      if (fileUploadRes.type !== 'success') {
        throw new Error(fileUploadRes.message)
      }

      await prisma.Tenant.update({
        where: {
          id: result.id
        },
        data: {
          logoPath: logoPath
        }
      })
    }

    return { type: 'success', message: `Successfully registered the tenant : ${result.name}, assigned ID : ${result.id}`, id: result.id }
  } catch (err) {
    console.log(err);

    return { type: 'error', message: `An error occurred while registering the tenant : ${err}` }
  }
}



export async function editTenantAction(formData, id) {
  const name = formData.get("name");
  const contact = formData.get("contact");
  const address = formData.get("address");
  const clientId = formData.get("clientId");
  const secretKey = formData.get("secretKey");
  const homeUrl = formData.get("homeUrl");
  const mobileUrl = formData.get("mobileUrl");
  // const bgColor = formData.get("bgColor");
  // const textColor = formData.get("textColor");
  // const textHoverColor = formData.get("textHoverColor");
  // const borderColor = formData.get("borderColor");
  // const categoryTextColor = formData.get("textCategoryColor");
  const imagePath = formData.get("imagePath");
  const file = formData.get("logoPath")

  // handle File Upload

  let logoPath;
  let newFileName;

  if (file && file.name && file.name !== 'undefined') {
    newFileName = id + '_' + file.name;
    logoPath = '/img/' + newFileName;
  }


  // const logoFile = formData.get("logoPath");
  // let logoPath = null;

  // if (logoFile && logoFile instanceof File) {
  //   const fileName = `${Date.now()}-${logoFile.name}`;
  //   const filePath = `/upload/${fileName}`;
  //   logoPath = filePath;
  // }

  try {
    const existingTenant = await prisma.Tenant.findUnique({
      where: {
        name,
        ...(id && {
          NOT: {
            id: id
          }
        })
      }

    });

    if (existingTenant) {
      return { type: 'warning', message: `Tenant is exists with the name : , ${name}` }
    }

    const updateData = {
      name,
      contact,
      address,
      clientId,
      secretKey,
      homeUrl,
      mobileUrl,
      logoPath,
      // bgColor,
      // textColor,
      // textHoverColor,
      // borderColor,
      // categoryTextColor,
      ...(logoPath && { logoPath }) // Only include logoPath if it's defined
    };

    const result = await prisma.Tenant.update({
      where: {
        id
      },
      data: updateData
    });

    if (logoPath) {
      const fileUploadRes = await uploadFileNew(file, newFileName, "img")
      if (fileUploadRes.type !== 'success') {
        throw new Error(fileUploadRes.message)
      }
    }

    // revalidatePath(`/dashboard/tenant/${id}`)

    return { type: 'success', message: `Successfully updated the tenant : ${result.name}, assigned ID : ${result.id}`, id: result.id }
  } catch (err) {
    return { type: 'error', message: `An error occurred while registering the tenant : ${err}` }
  }
}


export async function enableDisableTenant(id) {

  try {
    // Fetch the current tenant to get the current 'active' status
    const tenant = await prisma.Tenant.findUnique({
      where: {
        id: id
      }
    });

    if (!tenant) {
      throw new Error(`Tenant with id ${id} not found`);
    }

    // Toggle the 'active' status
    const updatedTenant = await prisma.Tenant.update({
      where: {
        id: id
      },
      data: {
        isActive: !tenant.isActive
      }
    });

    return { type: 'success', message: `Successfully updated status of the tenant ${tenant?.name}` }

  } catch (err) {
    return { type: 'error', message: "Error updating tenant status:" }
  }
}
