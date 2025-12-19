ALTER TABLE "tasc" ADD COLUMN "created_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tasc" ADD CONSTRAINT "tasc_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasc_member" DROP COLUMN "role";