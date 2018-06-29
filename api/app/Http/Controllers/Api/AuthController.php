<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\User;
use Hash;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('jwt.check', ['except' => ['login']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            // If the authentication attempts fail, we will try
            // to check the password with the old symfony encoding
            if(isset($credentials['email'])){
                $username = $credentials['email'];
            } else {
                return response()->json([
                    'error' => 'Unauthorized.  No Email.'
                ], 401);
            }
            $username = 
            $user = User::where('email', $credentials['email'])
                ->orWhere('username', $credentials['email'])->first();
            // Can we find a user?
            if ($user) {
                $password = $credentials['password'];
                $merged = $password . '{' . $user->salt . '}';
                $digest = hash('sha512', $merged, true);
                for ($i = 1; $i < 5000; ++$i) {
                    $digest = hash('sha512', $digest . $merged, true);
                }
                $encoded = base64_encode($digest);
                if($user->password !==  $encoded){
                    return response()->json([
                        'error' => 'Unauthorized.  Legacy Password.'
                    ], 401);
                }
                $user->password = $user->password = Hash::make($credentials['password']);
                $user->save();
                $token = auth()->attempt($credentials);
            }
        }
        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function check()
    {
        if(auth()->user()){
            return $this->respondWithToken(auth()->refresh());
        }
        return response()->json([
            'authenticated' => false,
            'error' => 'Unauthorized.  No Email.'
        ], 401);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'authenticated' => true,
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => Auth::user()->toArray()
        ]);
    }
}