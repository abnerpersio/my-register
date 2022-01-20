-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "url" VARCHAR(255),
    "s3_key" VARCHAR(255),

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "image_id" INTEGER NOT NULL,
    "gender" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "images"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
