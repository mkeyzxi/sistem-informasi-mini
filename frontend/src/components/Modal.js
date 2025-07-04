// // const Modal = {
// //   show: (title, content, onSave, onCancel) => {
// //     const modalHtml = `
// //       <div id="dynamic-modal" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
// //         <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
// //           <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
// //           <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
// //           <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
// //             <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
// //               <div class="sm:flex sm:items-start">
// //                 <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
// //                   <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
// //                     ${title}
// //                   </h3>
// //                   <div class="mt-2" id="modal-content">
// //                     ${content}
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //             <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
// //               <button id="modal-save-btn" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
// //                 Save
// //               </button>
// //               <button id="modal-cancel-btn" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
// //                 Cancel
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     `;
    
// //     document.body.insertAdjacentHTML('beforeend', modalHtml);

// //     const saveBtn = document.getElementById('modal-save-btn');
// //     const cancelBtn = document.getElementById('modal-cancel-btn');

// //     const saveHandler = () => {
// //         if(onSave) onSave();
// //         Modal.hide();
// //     };

// //     const cancelHandler = () => {
// //         if(onCancel) onCancel();
// //         Modal.hide();
// //     };

// //     saveBtn.addEventListener('click', saveHandler);
// //     cancelBtn.addEventListener('click', cancelHandler);
// //   },

// //   hide: () => {
// //     const modal = document.getElementById('dynamic-modal');
// //     if (modal) {
// //       modal.remove();
// //     }
// //   }
// // };

// // export default Modal;



// const Modal = {
//   /**
//    * Menampilkan modal dengan konten dan opsi yang diberikan.
//    * @param {string} title - Judul modal.
//    * @param {string} content - Konten HTML untuk isi modal.
//    * @param {function} onSave - Callback async yang dijalankan saat tombol save diklik. Harus return `true` untuk menutup modal.
//    * @param {function} [onCancel] - Callback opsional saat modal ditutup (cancel atau 'x').
//    * @param {string} [saveBtnText='Save'] - Teks untuk tombol save.
//    */
//   show: (title, content, onSave, onCancel, saveBtnText = 'Save') => {
//     // Jika argumen ke-4 adalah string, anggap itu sebagai saveBtnText (untuk kompatibilitas)
//     if (typeof onCancel === 'string') {
//         saveBtnText = onCancel;
//         onCancel = undefined;
//     }

//     const modalHtml = `
//       <div id="dynamic-modal" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//         <div class="flex items-center sm:items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          
//           <!-- Latar belakang overlay -->
//           <div id="modal-overlay" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          
//           <!-- Trik untuk memusatkan modal secara vertikal -->
//           <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
//           <!-- Panel Modal -->
//           <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md sm:max-w-lg flex gap-4 flex-col">
            
//             <!-- Header Modal dengan Tombol Close -->
//             <div class="bg-white px-4 pt-5 sm:px-6 flex justify-between items-center">
//                 <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
//                     ${title}
//                 </h3>
//                 <button id="modal-close-btn" class="text-gray-400 hover:text-gray-600">
//                     <span class="sr-only">Close</span>
//                     <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                 </button>
//             </div>

//             <!-- Konten Modal -->
//             <div class="px-4 py-5 sm:p-6" id="modal-content">
//               ${content}
//             </div>

//             <!-- Footer Modal dengan Tombol Aksi -->
//             <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
//               <button id="modal-save-btn" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
//                 ${saveBtnText}
//               </button>
//               <button id="modal-cancel-btn" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     `;
    
//     document.body.insertAdjacentHTML('beforeend', modalHtml);

//     const saveBtn = document.getElementById('modal-save-btn');
//     const cancelBtn = document.getElementById('modal-cancel-btn');
//     const closeBtn = document.getElementById('modal-close-btn');
//     const overlay = document.getElementById('modal-overlay');

//     const saveHandler = async () => {
//       if (onSave) {
//         const originalText = saveBtn.innerHTML;
//         saveBtn.disabled = true;
//         saveBtn.innerHTML = 'Processing...';

//         const success = await onSave();
        
//         // Hanya tutup modal jika callback onSave mengembalikan nilai true
//         if (success) {
//           Modal.hide();
//         } else {
//           // Kembalikan tombol ke keadaan semula jika gagal
//           saveBtn.disabled = false;
//           saveBtn.innerHTML = originalText;
//         }
//       } else {
//         Modal.hide(); // Jika tidak ada onSave, langsung tutup
//       }
//     };

//     const cancelHandler = () => {
//       if (onCancel) onCancel();
//       Modal.hide();
//     };

//     saveBtn.addEventListener('click', saveHandler);
//     cancelBtn.addEventListener('click', cancelHandler);
//     closeBtn.addEventListener('click', cancelHandler);
//     overlay.addEventListener('click', cancelHandler);
//   },

//   hide: () => {
//     const modal = document.getElementById('dynamic-modal');
//     if (modal) {
//       modal.remove();
//     }
//   }
// };

// export default Modal;





const Modal = {
  /**
   * Menampilkan modal dengan konten dan opsi yang diberikan.
   * @param {string} title - Judul modal.
   * @param {string} content - Konten HTML untuk isi modal.
   * @param {function} onSave - Callback async yang dijalankan saat tombol save diklik. Harus return `true` untuk menutup modal.
   * @param {function} [onCancel] - Callback opsional saat modal ditutup (cancel atau 'x').
   * @param {string} [saveBtnText='Save'] - Teks untuk tombol save.
   */
  show: (title, content, onSave, onCancel, saveBtnText = 'Save') => {
    // Jika argumen ke-4 adalah string, anggap itu sebagai saveBtnText (untuk kompatibilitas)
    if (typeof onCancel === 'string') {
        saveBtnText = onCancel;
        onCancel = undefined;
    }

    const modalHtml = `
      <div id="dynamic-modal" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          
          <!-- Latar belakang overlay -->
          <div id="modal-overlay" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
          
          <!-- Trik untuk memusatkan modal secara vertikal -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <!-- Panel Modal -->
          <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-md sm:max-w-lg">
            
            <!-- Header Modal dengan Tombol Close -->
            <div class="bg-white px-4 pt-5 sm:px-6 flex justify-between items-center">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    ${title}
                </h3>
                <button id="modal-close-btn" class="text-gray-400 hover:text-gray-600">
                    <span class="sr-only">Close</span>
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Konten Modal -->
            <div class="px-4 py-5 sm:p-6" id="modal-content">
              ${content}
            </div>

            <!-- Footer Modal dengan Tombol Aksi -->
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button id="modal-save-btn" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                ${saveBtnText}
              </button>
              <button id="modal-cancel-btn" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const saveBtn = document.getElementById('modal-save-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const closeBtn = document.getElementById('modal-close-btn');
    const overlay = document.getElementById('modal-overlay');

    const saveHandler = async () => {
      if (onSave) {
        const originalText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = 'Processing...';

        const success = await onSave();
        
        // Hanya tutup modal jika callback onSave mengembalikan nilai true
        if (success) {
          Modal.hide();
        } else {
          // Kembalikan tombol ke keadaan semula jika gagal
          saveBtn.disabled = false;
          saveBtn.innerHTML = originalText;
        }
      } else {
        Modal.hide(); // Jika tidak ada onSave, langsung tutup
      }
    };

    const cancelHandler = () => {
      if (onCancel) onCancel();
      Modal.hide();
    };

    saveBtn.addEventListener('click', saveHandler);
    cancelBtn.addEventListener('click', cancelHandler);
    closeBtn.addEventListener('click', cancelHandler);
    overlay.addEventListener('click', cancelHandler);
  },

  hide: () => {
    const modal = document.getElementById('dynamic-modal');
    if (modal) {
      modal.remove();
    }
  }
};

export default Modal;