<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JenisKerusakanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_kerusakan' => 'required|string|max:255',
            'deskripsi' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'nama_kerusakan.required' => 'Nama kerusakan wajib diisi',
            'nama_kerusakan.max' => 'Nama kerusakan maksimal 255 karakter',
        ];
    }
}
