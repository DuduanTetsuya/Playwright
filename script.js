class Latihan{
    //Buatlah sebuah fungsi yang dapat menghitung jumlah kata dalam sebuah kalimat.
    // Contoh: Jika kalimat yang diberikan adalah “Halo, nama saya John Doe”, maka hasilnya adalah 5.
    WordCounter(str){
      const lower = str.toLowerCase();
      const nospace = lower.trim().split(/\s+/);
      const count = nospace.length;
      return `Jumlah kata pada ${str} adalah ${count}`;
    }
  
    //Buatlah sebuah fungsi yang dapat menemukan angka terbesar dari sebuah array.
    // Contoh: Jika array yang diberikan adalah [1, 5, 3, 7, 2], maka hasilnya adalah 7.
    HighestNumber(arr){
      let highest = 0;
      for(let i = 0; i < arr.length; i++){
        if (arr[i] > highest){ highest = arr[i] }
      }
      return `Angka terbesar dari ${arr} adalah ${highest}`;
    }
  
    //Buatlah sebuah fungsi untuk mengurutkan angka dalam sebuah array dari yang terkecil ke yang terbesar.
    // Contoh: Jika array yang diberikan adalah [3, 1, 5, 2, 4], maka hasilnya adalah [1, 2, 3, 4, 5]
    SortLowHigh(arr){
      const sorted = [...arr].sort((a,b) => a-b);
      return `Urutan kecil ke besar pada ${arr} adalah ${sorted}`;
    }
  
    //Buatlah sebuah fungsi yang dapat menentukan apakah sebuah kata atau kalimat adalah palindrom atau tidak.
    // Palindrom adalah kata atau kalimat yang dapat dibaca sama dari depan maupun dari belakang.
    // Contoh: Jika kata yang diberikan adalah “level”, maka hasilnya adalah “palindrom”.
    PalindromCheck(str){
      let hasil = '';
      const lowered = str.toLowerCase().trim().replace(/[^a-zA-Z0-9 ]/g, '');
      const reverse = lowered.split('').reverse().join('');
      if(lowered === reverse){ hasil = 'Palindrom'}
      else{ hasil = 'bukan Palindrom'};
      return `Kata ${str} adalah ${hasil}`;
    }
  
    //Cetak angka 1-100. Jika habis dibagi 3, cetak "Fizz". Jika habis dibagi 5, cetak "Buzz".
    //Jika habis dibagi 3 dan 5, cetak "FizzBuzz".
    FizzBuzz(){
      for(let i=1; i<=100; i++){
        let hasil = '';
        if(i%3 === 0 && i%5 === 0){ hasil = 'FizzBuzz' }
        else if( i%3 === 0){ hasil = 'Fizz' }
        else if( i%5 === 0){ hasil = 'Buzz' }
        else{ hasil = i }
        console.log(hasil);
      }
    }

    //random array
    getRandomItems(arr){
      let shuffled = [...arr]; // Salin array agar tidak mengubah aslinya
      const numItems = 3;
      for (let i=0; i<shuffled.length; i++) {
          let j = Math.floor(Math.random() * (i + 1)); // Pilih indeks acak
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Tukar elemen
      }
      return shuffled.slice(0, numItems);
    }

    //random username
    randomUsername(){
      let username = '';
      const stok = 'abcdefghijklmnopqrstuvwxyz0123456789'
      for(let i=0; i<10; i++){
        username += stok[Math.floor(Math.random() * stok.length)]
      }
      return `${username}@example.com`;
    }
  }
  
  const testLatihan = new Latihan();
  console.log(testLatihan.WordCounter('HWAEUAWDKA DIkadpawdawkr awrkawkr2oasdkaosd'));
  console.log(testLatihan.HighestNumber([1,3,4,5,35,8,3,3,1,1,2,3,6,7,22]));
  console.log(testLatihan.SortLowHigh([1,3,4,5,6,8,3,3,1,1,2,3,6,7,22]));
  console.log(testLatihan.PalindromCheck('kasur ini rusak   '));
  console.log(testLatihan.getRandomItems(["January", "February", "March", "April", "May", "June", "July"]));
  console.log(testLatihan.randomUsername());
  //testLatihan.FizzBuzz();