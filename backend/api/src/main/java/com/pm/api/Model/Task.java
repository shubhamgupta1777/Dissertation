package com.pm.api.Model;

import java.sql.Date;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;




@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "tasks")
public class Task {

    @Id
    private ObjectId id;
    private String name;
    private String description;
    private Date startDate;
    private Date endDate;
    private Status status;
    private int progress;
    private Priority priority;

    @DocumentReference
    private List<User> students;

    @DocumentReference
    private List<SubTask> sub_tasks;

}
