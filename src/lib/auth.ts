import { supabase } from "@/integrations/supabase/client";

export async function isTeamMember(userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  return data === true;
}

export function authErrorMessage(message: string) {
  if (/invalid login/i.test(message)) return "E-mail ou senha incorretos.";
  if (/not confirmed/i.test(message)) return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
  if (/already registered/i.test(message)) return "Este e-mail já tem cadastro. Faça login.";
  if (/password/i.test(message)) return "A senha não atende aos requisitos (mínimo de 8 caracteres).";
  return "Não foi possível concluir. Tente novamente.";
}
