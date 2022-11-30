create table User (
	UserID int AUTO_INCREMENT PRIMARY KEY,
    email varchar(255),
    password varchar(255)
);


insert into User (email, password)
values('demo1', '123'),
('demo2', '123'),
('demo3', '123'),
('demo4', '123');

select * from User;
