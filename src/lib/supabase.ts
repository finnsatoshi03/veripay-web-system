import { createClient } from "@supabase/supabase-js";

import { config } from "@/lib/configs/api-config";

const supabase = createClient(config.supabase.URL, config.supabase.KEY);

export default supabase;
