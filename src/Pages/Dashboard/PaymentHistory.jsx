import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PaymentHistory = () => {

const {user} = useAuth()
const axiosSecure = useAxiosSecure()
const { data: payments = [] } = useQuery({
  queryKey: ["payments", user?.email],
  enabled: !!user?.email,   
  queryFn: async () => {
    const res = await axiosSecure.get(`/payments?email=${user.email}`);
    return res.data;
  },
});


    return (
        <div>
            <title>Payment History | Create Arena</title>

           <div>
  <h2 className="text-4xl">Payment History ({payments.length})</h2>

  <div className="overflow-x-auto">
  <table className="table table-zebra">

    <thead>
      <tr>
        <th>No.</th>
        <th>Email</th>
        <th>Amount</th>
        <th>TrackingId</th>
        <th>Paid Time</th>
      </tr>
    </thead>
    <tbody>
      {
        payments.map((payment, index) => <tr key={payment._id}>
        <th>{index + 1}</th>
        <td>{payment.email}</td>
        <td>{payment.trackingId}</td>
        <td>{payment.amount}</td>
        <td>{payment.createdAt}</td>
      </tr>)
      }
      
    </tbody>
  </table>
</div>
</div>
        </div>
    );
};

export default PaymentHistory;