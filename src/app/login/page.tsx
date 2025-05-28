
// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, GoogleAuthProvider, signInWithPopup, signInAnonymously } from "@/lib/firebase"; // Import db and Google providers
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore methods
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, UserX } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Inline SVG for Google Icon
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6.02C43.67 36.99 46.98 31.25 46.98 24.55z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6.02c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);


const loginSchema = z.object({
  email: z.string().email("Por favor, introduce un correo electrónico válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "¡Bienvenido!", description: "Has iniciado sesión correctamente." });
      router.push("/"); 
    } catch (error: any) {
      console.error("Error de inicio de sesión:", error);
      console.error("Full Login Error Object:", JSON.stringify(error, null, 2));
      let errorMessage = "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Correo electrónico o contraseña incorrectos.";
      } else if (error.code === "auth/configuration-not-found") {
        errorMessage = "El método de inicio de sesión por correo no está habilitado. Contacta al administrador.";
      } else if (error.code === "auth/api-key-not-valid") {
        errorMessage = "La clave API de Firebase no es válida. Revisa la configuración.";
      } else if (error.code === "auth/unauthorized-domain"){
        errorMessage = "Este dominio no está autorizado para operaciones de Firebase. Revisa la configuración.";
      }
      toast({
        title: "Error de inicio de sesión",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            createdAt: new Date().toISOString(),
            savingsGoal: { targetAmount: 0 }, 
            photoURL: user.photoURL || null,
          });
          toast({ title: "¡Cuenta creada con Google!", description: "Bienvenido a KakeboApp." });
        } else {
          toast({ title: "¡Bienvenido de vuelta!", description: "Has iniciado sesión con Google." });
        }
      } catch (firestoreError: any) {
        console.error("Error de Firestore durante el inicio de sesión con Google:", firestoreError);
        console.error("Full Firestore Error Object (Google Sign-In):", JSON.stringify(firestoreError, null, 2));
        toast({ 
          title: "Error de Perfil (Google)", 
          description: "Se autenticó tu cuenta de Google, pero hubo un problema al acceder/guardar tus datos de perfil. Por favor, intenta de nuevo.",
          variant: "destructive"
        });
        setIsGoogleLoading(false);
        return;
      }
      
      router.push("/");
    } catch (error: any) {
      console.error("Error de inicio de sesión con Google:", error);
      console.error("Full Google Sign-In Error Object:", JSON.stringify(error, null, 2));
      let errorMessage = "No se pudo iniciar sesión con Google.";
       if (error.code === "auth/account-exists-with-different-credential") {
        errorMessage = "Ya existe una cuenta con este correo electrónico usando un método de inicio de sesión diferente.";
      } else if (error.code === "auth/unauthorized-domain"){
        errorMessage = "Este dominio no está autorizado. Revisa tu configuración de Firebase y Google Cloud.";
      } else if (error.code === "auth/api-key-not-valid") {
        errorMessage = "La clave API de Firebase no es válida. Revisa la configuración.";
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "La ventana de inicio de sesión con Google fue cerrada antes de completar.";
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Se canceló la solicitud de ventana emergente (popup).";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "El navegador bloqueó la ventana emergente (popup). Revisa la configuración de tu navegador.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "El inicio de sesión con Google no está habilitado en tu proyecto Firebase.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Error de red al intentar iniciar sesión con Google. Verifica tu conexión.";
      }
      toast({
        title: "Error con Google",
        description: error.message || errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  const handleAnonymousSignIn = async () => {
    setIsAnonymousLoading(true);
    try {
      await signInAnonymously(auth);
      toast({ title: "Sesión Anónima Iniciada", description: "Puedes explorar la aplicación. Tu progreso no se guardará de forma permanente a menos que vincules tu cuenta." });
      router.push("/");
    } catch (error: any) {
      console.error("Error de inicio de sesión anónimo:", error);
      console.error("Full Anonymous Sign-In Error Object:", JSON.stringify(error, null, 2));
      let errorMessage = "No se pudo iniciar sesión de forma anónima.";
      if (error.code === "auth/operation-not-allowed" || error.code === "auth/unauthorized-domain") {
        errorMessage = "El inicio de sesión anónimo no está habilitado o el dominio no está autorizado. Contacta al administrador.";
      }
      toast({
        title: "Error Anónimo",
        description: error.message || errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsAnonymousLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>Accede a tu cuenta KakeboApp.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  {...register("email")}
                  className="pl-10"
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="pl-10"
                />
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading || isAnonymousLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O continuar con
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading || isAnonymousLoading}>
            {isGoogleLoading ? "Cargando..." : <><GoogleIcon /> <span className="ml-2">Google</span></>}
          </Button>
          
          <Button variant="outline" className="w-full" onClick={handleAnonymousSignIn} disabled={isLoading || isGoogleLoading || isAnonymousLoading}>
             {isAnonymousLoading ? "Cargando..." : <><UserX className="mr-2 h-5 w-5" /> Continuar como Anónimo</>}
          </Button>

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
           <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </CardFooter>
      </Card>
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>
          Desarrollado por <a href="https://www.eduardoalsina.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">Eduardo J. Alsina E.</a> para <a href="https://www.cesurformacion.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">CESUR</a>.
        </p>
        <p>&copy; 2025 Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
