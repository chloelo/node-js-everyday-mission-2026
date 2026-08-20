## **題目**

> 延續 Day 34 設計的線上課程平台，migration 已經把四張表都建好了，結構如下：
>
> ```
> coaches.id  ← courses.coach_id       這堂課是哪位教練開的
>   users.id  ← enrollments.user_id    這筆報名是哪位學員
> courses.id  ← enrollments.course_id  這筆報名是哪堂課
> ```
>
> 你要寫一個 Seeder，塞入幾筆教練、學員、課程與報名紀錄，確認這四張表都能正常寫入。

根據以上情境，回答下列問題：

1. 為什麼 Seeder 通常會設計成「先清空、再重新寫入」？如果只寫入、不清空，重複執行幾次之後會發生什麼事？
2. 這四張表（`coaches`、`users`、`courses`、`enrollments`）的寫入順序該怎麼安排？請說明理由（提示：想想每個外鍵分別指向誰）。
3. 清除的順序又該怎麼安排？如果先清了 `courses`，但 `enrollments` 還有資料，會發生什麼事？
4. 寫入一筆報名紀錄（`enrollments`）時，需要填 `user_id` 和 `course_id` 兩個外鍵。用 ORM 的話，除了「先查出學員和課程的 id、再填進外鍵」之外，還有什麼更直覺的做法？

## 回答

### 1.

Seeder 通常會先清空再重新寫入，這樣不管執行幾次，最後都會是同一套乾淨的初始資料。

如果只寫入、不清空，每執行一次就會再新增一批資料，執行幾次後就會出現重複資料，資料表也會越來越亂。

### 2.

寫入順序可以是：

`coaches` → `users` → `courses` → `enrollments`

其中 `coaches` 和 `users` 彼此沒有依賴，所以兩者的順序可以互換。

接著要先寫 `courses`，因為 `courses.coach_id` 指向 `coaches.id`，所以教練要先存在。

最後才寫 `enrollments`，因為它的 `user_id` 和 `course_id` 分別指向 `users` 和 `courses`，所以學員和課程都要先存在。

原則就是：先寫「被指向」的資料，再寫「指向它」的資料。

### 3.

清除順序要跟寫入相反：

`enrollments` → `courses` → `coaches` / `users`

`coaches` 和 `users` 的先後順序可以互換。

如果先清除 `courses`，但 `enrollments` 還有資料，因為 `enrollments.course_id` 還指向那些課程，資料庫會阻止刪除 `courses` 的資料，並回傳錯誤。

### 4.

可以直接把已經取得的學員和課程 entity 傳給 ORM：

    await enrollmentRepo.save({
      user: user,
      course: course,
    });

例如：

    const user = await userRepo.save({ name: '小華' });

    const course = await courseRepo.save({
      title: '重訓基礎班',
      coach: coach,
    });

    await enrollmentRepo.save({
      user: user,
      course: course,
    });

這樣不用自己另外取 `user_id` 和 `course_id`，ORM 會根據 `user` 和 `course` 自動處理對應的外鍵。