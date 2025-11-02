import { connectDb } from '@/dbConfig/dbConfig';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user.model';

connectDb();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const name = searchParams.get('name') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '30');

  if (!role) {
    return NextResponse.json({
      success: false,
      message: 'Please tell the role of user',
      statusCode: 400,
    });
  }

  const skip = (page - 1) * limit;

  try {
    let results;

    if (name) {
      results = await User.aggregate([
        {
          $match: {
            role: role.toLowerCase(),
            name: { $regex: name, $options: 'i' },
          },
        },
        {
          $addFields: {
            startsWith: {
              $cond: [
                {
                  $regexMatch: {
                    input: '$name',
                    regex: '^' + name,
                    options: 'i',
                  },
                },
                0,
                1,
              ],
            },
          },
        },
        { $sort: { startsWith: 1, name: 1 } },
        { $skip: skip },
        { $limit: limit },
        { $project: { _id: 1, name: 1, email: 1 } },
      ]);
    } else {
      results = await User.find({ role: role.toLowerCase() })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);
    }

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error: unknown) {
    let message = 'Something went wrong';

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        message,
        data: null,
      },
      { status: 500 }
    );
  }
}
