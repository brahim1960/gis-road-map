<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KerusakanJalanRequest extends FormRequest
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
            'point' => 'required|string',
            'alamat' => 'required|string|max:255',
            'kecamatan_id' => 'required|exists:kecamatan,id',
            'tingkat_kerusakan' => 'required|in:ringan,sedang,berat',
            'jenis_kerusakan_id' => 'required|exists:jenis_kerusakan,id',
            'tanggal' => 'nullable|date',

            'km_awal' => 'nullable|integer|min:0',
            'm_awal' => 'nullable|integer|min:0|max:999',
            'km_akhir' => 'nullable|integer|min:0',
            'm_akhir' => 'nullable|integer|min:0|max:999',

            'panjang' => 'nullable|numeric|min:0',
            'lebar' => 'nullable|numeric|min:0',
            'tinggi' => 'nullable|numeric|min:0',

            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'deskripsi' => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'point.required' => 'Lokasi harus dipilih pada peta',
            'alamat.required' => 'Alamat harus diisi',
            'kecamatan_id.required' => 'Kecamatan harus diisi dengan dengan memilih lokasi di peta',
            'kecamatan_id.exists' => 'Kecamatan tidak ada',
            'tingkat_kerusakan.required' => 'Tingkat kerusakan harus dipilih',
            'tingkat_kerusakan.in' => 'Tingkat kerusakan hanya boleh: ringan, sedang, atau berat',
            'jenis_kerusakan_id.required' => 'Jenis kerusakan harus dipilih',
            'jenis_kerusakan_id.exists' => 'Jenis kerusakan tidak ada',
            'tanggal.date' => 'Format tanggal tidak valid',
            'gambar.image' => 'File harus berupa gambar',
            'gambar.mimes' => 'Format gambar harus jpeg, png, atau jpg',
            'gambar.max' => 'Ukuran gambar maksimal 2MB',

            'km_awal.integer' => 'KM awal harus berupa angka',
            'm_awal.integer' => 'Meter awal harus berupa angka',
            'km_akhir.integer' => 'KM akhir harus berupa angka',
            'm_akhir.integer' => 'Meter akhir harus berupa angka',

            'panjang.numeric' => 'Panjang harus berupa angka',
            'lebar.numeric' => 'Lebar harus berupa angka',
            'tinggi.numeric' => 'Tinggi harus berupa angka',
        ];
    }
}
