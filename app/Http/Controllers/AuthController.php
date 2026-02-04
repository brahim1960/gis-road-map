<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function index ()
    {
        return view('guest.login', [
            'title' => 'Login'
        ]);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username'  => 'required|min:5|max:255',
            'password'  => 'required|min:5|max:255',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            if (Auth::user()->role != 'admin') {
                return redirect('/')->with('success', 'Login berhasil');
            }

            return redirect(url('dashboard'))->with('success', 'Login berhasil');
        }

        return back()->with('error', 'Login gagal, username atau password salah!');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        if (url('/dashboard/*')) {
            return redirect('/');
        }
        return back();
    }
}
