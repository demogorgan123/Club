import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://itmnkbocsnbwjqbxxtfc.supabase.co";
const supabaseAnonKey = "sb_publishable_YoctBMUL4je5g4saPUnFAQ_S26";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
