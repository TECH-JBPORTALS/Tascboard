CREATE TABLE "tasc" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"name" varchar(256) NOT NULL,
	"description" text,
	"face_id" varchar(256) NOT NULL,
	"track_id" text NOT NULL,
	"status" text DEFAULT 'todo' NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "tasc_member" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"tasc_id" text NOT NULL,
	"track_member_id" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "track" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"name" varchar(256) NOT NULL,
	"description" text,
	"board_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "track_member" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	"track_id" text NOT NULL,
	"board_member_id" text NOT NULL,
	"user_id" text NOT NULL,
	"is_leader" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "board_member" DROP CONSTRAINT "board_member_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "board_member" DROP CONSTRAINT "board_member_board_id_board_id_fk";
--> statement-breakpoint
DROP INDEX "name_idx";--> statement-breakpoint
ALTER TABLE "board" ALTER COLUMN "start_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "board" ALTER COLUMN "end_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tasc" ADD CONSTRAINT "tasc_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasc_member" ADD CONSTRAINT "tasc_member_tasc_id_tasc_id_fk" FOREIGN KEY ("tasc_id") REFERENCES "public"."tasc"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasc_member" ADD CONSTRAINT "tasc_member_track_member_id_track_member_id_fk" FOREIGN KEY ("track_member_id") REFERENCES "public"."track_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasc_member" ADD CONSTRAINT "tasc_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track" ADD CONSTRAINT "track_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_member" ADD CONSTRAINT "track_member_track_id_track_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."track"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_member" ADD CONSTRAINT "track_member_board_member_id_board_member_id_fk" FOREIGN KEY ("board_member_id") REFERENCES "public"."board_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "track_member" ADD CONSTRAINT "track_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tasc_name_index" ON "tasc" USING btree ("name");--> statement-breakpoint
CREATE INDEX "track_name_index" ON "track" USING btree ("name");--> statement-breakpoint
ALTER TABLE "board_member" ADD CONSTRAINT "board_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_member" ADD CONSTRAINT "board_member_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "board_name_index" ON "board" USING btree ("name");