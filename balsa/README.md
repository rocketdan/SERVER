

# Balsa

## Table of Contents
- [Fileupload](#Fileupload)
- [회사정보](#company)
- [account](#account)

## FileUpload
매개변수 uploaddata, category

url
```
url: /upload
```

파일은 n개 동시 업로드 가능.

리스폰스 값 :
```
{
	"error" : null,
	"data" : [ {
		"file_uuid" : "af1cd51b-3e2f-4aa6-ada6-91d024fd4932",
		"file_category" : "test",
		"file_name" : "rocketdan.sql"
	} ]
}
```

## company
####회사정보 받아오기
```
url: /company_info_list
```
회사아이디 이용하여 다일 항목 받아오기.

매개변수 이름은 id.

값은 company_info 테이블의 seq_id 값.
```
url: /company_info_list?id=?
```

####회사정보 update

파라미터 

id => update 하고 싶은 seq_id 값 


ceo_name,company_num,company2_num,

tour_num,sub_num,type,sub_type,company_reg_date,

tel_num,tel2_num,fax_num,fax2_num,post_address,

adress,work_location

각 항목을 제외시 널값으로 적용됨.


```
url: /company_info_list/update
```

####회사정보 delete

파라미터

id => 삭제하고 싶은 seq_id 값 

```
url: /company_info_list/delete
```

####회사정보 insert

파라미터 

company_name,ceo_name,company_num,company2_num,

tour_num,sub_num,type,sub_type,company_reg_date,

tel_num,tel2_num,fax_num,fax2_num,post_address,

adress,work_location

각 항목을 제외시 널값으로 적용됨.

```
url: /company_info_list/insert
```

## account
####계좌정보 받아오기
```
url: /account/list
```
회사아이디 이용하여 다일 항목 받아오기.

매개변수 이름은 id.

값은 company_account 테이블의 seq_id 값.
```
url: /account/list?id=?
```

####계좌정보 update

파라미터 

id => update 하고 싶은 seq_id 값 


company_id,bank_name,account_num,account_auth,note

각 항목을 제외시 널값으로 적용됨.


```
url: /account/update
```

- response

value는 update 행수. 0이면 데이터가 없음.

저장되지 않은 데이터 또는 삭제된 데이터.

error는 발생시 에러 메시지 전송. 
```
{"data":"value","error":null}
```

####계좌정보 delete

파라미터

id => 삭제하고 싶은 seq_id 값 

```
url: /account/delete
```

- response

value는 delete 행수. 0일시 삭제데이터가 없음 .

error는 발생시 에러 메시지 전송. 
```
{"data":"value","error":null}
```

####계좌정보 insert

파라미터 

company_id,bank_name,account_num,account_auth,note

각 항목을 제외시 널값으로 적용됨.
- company_id 는 company_info의 seq_id 값 입니다.

```
url: /account/insert
```

- response

value는 insert 아이디

error는 발생시 에러 메시지 전송. 
```
{"data":"value","error":null}
```
test