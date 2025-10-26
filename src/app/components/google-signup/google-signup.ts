import { Component } from '@angular/core';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
@Component({
  selector: 'app-google-signup',
  imports: [SocialLoginModule],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('734613086299-cpet8k8rj72hitk4a5lmtur2o85i905i.apps.googleusercontent.com')
          }
        ]
      } as SocialAuthServiceConfig,
    },
  ],
  templateUrl: './google-signup.html',
  styleUrl: './google-signup.scss'
})
export class GoogleSignup {
  constructor(private authService: SocialAuthService) {}

signInWithGoogle(): void {
  this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
    console.log(user);
    // user.idToken -> send to backend
  });
}
  // decodeJWT(token) 
  // {
  //   let base64Url = token.split(".")[1];
  //   let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //   let jsonPayload = decodeURIComponent(
  //     atob(base64)
  //       .split("")
  //       .map(function (c) {
  //         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  //       })
  //       .join("")
  //   );
  //   return JSON.parse(jsonPayload);
  // }
  // handleCredentialResponse(response) {

  //   console.log("Encoded JWT ID token: " + response.credential);

  //   const responsePayload = this.decodeJWT(response.credential);

  //   console.log("Decoded JWT ID token fields:");
  //   console.log("  Full Name: " + responsePayload.name);
  //   console.log("  Given Name: " + responsePayload.given_name);
  //   console.log("  Family Name: " + responsePayload.family_name);
  //   console.log("  Unique ID: " + responsePayload.sub);
  //   console.log("  Profile image URL: " + responsePayload.picture);
  //   console.log("  Email: " + responsePayload.email);
  // }
}
