package com.hariesh.acer.DataCollectorApp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.HashMap;

public class CustomAdapter extends ArrayAdapter<DataModel> {

    private ArrayList<DataModel> dataSet;
    Context mContext;
    static HashMap<String,String> data_vals;

    // View lookup cache
    private static class ViewHolder {
        TextView label;
        EditText data;
    }



    public CustomAdapter(ArrayList<DataModel> data, Context context) {
        super(context, R.layout.list, data);
        this.dataSet = data;
        this.mContext=context;
        data_vals = new HashMap<>();

    }


    private int lastPosition = -1;

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        // Get the data item for this position
        DataModel dataModel = getItem(position);
        // Check if an existing view is being reused, otherwise inflate the view
        final ViewHolder viewHolder; // view lookup cache stored in tag

        final View result;

        if (convertView == null) {


            viewHolder = new ViewHolder();
            LayoutInflater inflater = LayoutInflater.from(getContext());
            convertView = inflater.inflate(R.layout.list, parent, false);
            viewHolder.label =  convertView.findViewById(R.id.head);
            viewHolder.data =  convertView.findViewById(R.id.editText4);
            viewHolder.data.setOnFocusChangeListener(new View.OnFocusChangeListener() {
                @Override
                public void onFocusChange(View v, boolean hasFocus) {
                    if (!hasFocus) {
                        CustomAdapter.data_vals.put(viewHolder.label.getText().toString(),viewHolder.data.getText().toString());
                    }
                }
            });



            result=convertView;

            convertView.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) convertView.getTag();
            result=convertView;
        }

        Animation animation = AnimationUtils.loadAnimation(mContext, (position > lastPosition) ? R.anim.up_from_bottom : R.anim.down_from_top);
        result.startAnimation(animation);
        lastPosition = position;


        viewHolder.label.setText(dataModel.getLabel());

        // Return the completed view to render on screen
        return convertView;
    }



}
