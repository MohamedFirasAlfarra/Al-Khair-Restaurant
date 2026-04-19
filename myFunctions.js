document.addEventListener('DOMContentLoaded', function () {
    console.log('************');
    document.querySelectorAll('.detail-check').forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            console.log('Checkbox changed');
            var targetId = this.dataset.target;
            console.log('Target ID:', targetId);
            var targetElement = document.getElementById(targetId);
            if (this.checked) {
                targetElement.classList.remove('hidden');
                console.log('Removed hidden class');
            } else {
                targetElement.classList.add('hidden');
                console.log('Added hidden class');
            }
        });
    });

    var continueButton = document.getElementById('continueButton');
    if (continueButton) {
        continueButton.addEventListener('click', function () {
            var selectedMeals = document.querySelectorAll('input[name="mealSelect[]"]:checked');
            if (selectedMeals.length === 0) {
                alert(' الرجاء اختر وجبة أولاً');
                return;
            }
            document.getElementById('formContainer').classList.remove('hidden');
            window.scrollTo(0, document.getElementById('formContainer').offsetTop - 100);
        });
    }

    var orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var selectedMeals = document.querySelectorAll('input[name="mealSelect[]"]:checked');
            var fullName = document.getElementById('fullName').value.trim();
            var orderDate = document.getElementById('orderDate').value.trim();
            var mobile = document.getElementById('mobile').value.trim();

            if (!fullName || !orderDate || !mobile) {
                alert(' الرجاء ملء جميع الحقول المطلوبة');
                return;
            }

            var namePattern = /^[A-Za-z]+ [A-Za-z]+$/;
            if (!namePattern.test(fullName)) {
                alert(' الاسم الكامل يجب أن يكون بالإنجليزية مع فراغ واحد فقط بين الاسم والكنية');
                return;
            }

            if (!orderDate) {
                alert(' الرجاء اختيار تاريخ الطلب');
                return;
            }

            var dateObj = new Date(orderDate);
            if (isNaN(dateObj.getTime())) {
                alert(' تاريخ الطلب غير صحيح');
                return;
            }

            var day = String(dateObj.getDate()).padStart(2, '0');
            var month = String(dateObj.getMonth() + 1).padStart(2, '0');
            var year = dateObj.getFullYear();
            var formattedDate = day + '-' + month + '-' + year;

            var mobilePattern = /^(09[3-6|8-9]\d{7})$/;
            if (!mobilePattern.test(mobile)) {
                alert(' رقم الموبايل يجب أن يكون رقماً سورياً صالحاً (MTN أو Syriatel)');
                return;
            }

            var bankAccount = document.getElementById('bankAccount').value.trim();
            if (bankAccount && !/^0\d{5}$/.test(bankAccount)) {
                alert(' رقم الحساب المصرفي يجب أن يكون 6 خانات ويبدأ بصفر');
                return;
            }

            var total = 0;
            var mealDetails = '';
            selectedMeals.forEach(function (meal) {
                var mealName = meal.value;
                var price = parseInt(meal.dataset.price);
                total += price;
                mealDetails += '• ' + mealName + ' ل.س\n';
            });

            var tax = total * 0.1;
            var finalTotal = total - tax;

            alert(
                ' تم استلام طلبك بنجاح! شكراً لثقتك بـ مطعم الخير.\n' +
                '------------------------------------------\n' +
                ' الوجبة المختارة:\n' + mealDetails +
                '------------------------------------------\n' +
                ' مجموع السعر: ' + total.toLocaleString() + ' ل.س\n' +
                ' الضريبة المستقطعة (10%): ' + tax.toLocaleString() + ' ل.س\n' +
                ' المبلغ الصافي للدفع: ' + finalTotal.toLocaleString() + ' ل.س\n' +
                '------------------------------------------\n' +
                ' اسم العميل: ' + fullName + '\n' +
                ' تاريخ الطلب: ' + formattedDate + '\n' +
                ' رقم الموبايل: ' + mobile + '\n' +
                '------------------------------------------\n'
            );

            orderForm.reset();
            document.getElementById('formContainer').classList.add('hidden');
            document.querySelectorAll('input[name="mealSelect[]"]').forEach(function (radio) {
                radio.checked = false;
            });
            document.querySelectorAll('.detail-check').forEach(function (checkbox) {
                checkbox.checked = false;
                checkbox.dispatchEvent(new Event('change'));
            });
        });
    }
});
